const prisma = require('../config/db');
const walletService = require('../services/walletService');

// GET /api/wallet
const getWallet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const balance = await walletService.getBalance(userId);

    const recentTransactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({
      success: true,
      data: {
        balance,
        recentTransactions,
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/wallet/transactions?page=
const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.walletTransaction.count({
        where: { userId },
      }),
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  getTransactions,
};
