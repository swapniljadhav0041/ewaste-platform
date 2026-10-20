const { z } = require('zod');
const prisma = require('../config/db');
const walletService = require('../services/walletService');

const offerSchema = z.object({
  partner: z.string().min(2, 'Partner name required'),
  title: z.string().min(2, 'Title required'),
  description: z.string().min(5, 'Description required'),
  creditCost: z.number().int().min(1, 'Credit cost must be greater than 0'),
  stock: z.number().int().min(1, 'Stock must be at least 1'),
  expiresAt: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

// GET /api/offers
const getOffers = async (req, res, next) => {
  try {
    const offers = await prisma.offer.findMany({
      where: {
        active: true,
      },
      orderBy: { creditCost: 'asc' },
    });

    res.json({
      success: true,
      data: offers,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/offers (ADMIN)
const createOffer = async (req, res, next) => {
  try {
    const validated = offerSchema.parse(req.body);

    const offer = await prisma.offer.create({
      data: {
        ...validated,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
      },
    });

    res.status(201).json({
      success: true,
      data: offer,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/offers/:id (ADMIN)
const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = offerSchema.partial().parse(req.body);

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        ...validated,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : undefined,
      },
    });

    res.json({
      success: true,
      data: offer,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/offers/:id/redeem (USER)
// Atomic check of balance and stock inside a transaction (Section 8)
const redeemOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch offer and verify stock
      const offer = await tx.offer.findUnique({
        where: { id },
      });

      if (!offer || !offer.active) {
        throw new Error('This reward offer is currently unavailable.');
      }

      if (offer.stock <= 0) {
        throw new Error('This offer is currently out of stock.');
      }

      // 2. Verify ledger balance
      const balance = await walletService.getBalance(userId, tx);
      if (balance < offer.creditCost) {
        throw new Error(`Insufficient credits. You need ${offer.creditCost} credits, but have ${balance}.`);
      }

      // 3. Decrement stock
      await tx.offer.update({
        where: { id },
        data: {
          stock: {
            decrement: 1,
          },
        },
      });

      // 4. Generate unique coupon code
      const randHex = Math.random().toString(36).substring(2, 7).toUpperCase();
      const cleanPartner = offer.partner.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
      const couponCode = `VOLT-${cleanPartner || 'GIFT'}-${randHex}`;

      // 5. Create redemption record
      const redemption = await tx.redemption.create({
        data: {
          userId,
          offerId: offer.id,
          couponCode,
          status: 'ISSUED',
        },
        include: {
          offer: true,
        },
      });

      // 6. Append negative REDEEM transaction to wallet ledger
      await tx.walletTransaction.create({
        data: {
          userId,
          type: 'REDEEM',
          amount: -offer.creditCost,
          refId: redemption.id,
          note: `Redeemed: ${offer.partner} - ${offer.title}`,
        },
      });

      return {
        couponCode,
        redemption,
        creditsDeducted: offer.creditCost,
      };
    });

    res.status(201).json({
      success: true,
      data: result,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/redemptions/mine (USER)
const getMyRedemptions = async (req, res, next) => {
  try {
    const redemptions = await prisma.redemption.findMany({
      where: { userId: req.user.id },
      include: {
        offer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: redemptions,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  redeemOffer,
  getMyRedemptions,
};
