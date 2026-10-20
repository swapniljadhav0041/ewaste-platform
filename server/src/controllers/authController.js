const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../config/db');
const walletService = require('../services/walletService');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional().nullable(),
  referralCode: z.string().optional().nullable(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'voltcycle-jwt-super-secret-key-32-chars-long-secure';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn }
  );
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        error: 'An account with this email address already exists.',
      });
    }

    // Resolve referral code if provided
    let referrerUser = null;
    if (validated.referralCode) {
      referrerUser = await prisma.user.findUnique({
        where: { referralCode: validated.referralCode.trim().toUpperCase() },
      });
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);
    const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanName = validated.name.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
    const newReferralCode = `VOLT-${cleanName || 'USER'}-${uniqueSuffix}`;

    const user = await prisma.user.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        phone: validated.phone?.trim() || null,
        passwordHash,
        role: 'USER',
        referralCode: newReferralCode,
        referredById: referrerUser ? referrerUser.id : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid email or password credentials',
      });
    }

    const match = await bcrypt.compare(validated.password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid email or password credentials',
      });
    }

    const token = generateToken(user);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      referralCode: user.referralCode,
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'User not found',
      });
    }

    const balance = await walletService.getBalance(user.id);

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          balance,
        },
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
