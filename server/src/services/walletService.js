const prisma = require('../config/db');

/**
 * Calculates current balance by aggregating all ledger transactions
 * @param {string} userId
 * @param {Object} dbClient - optional Prisma transaction client
 * @returns {Promise<number>} current balance
 */
async function getBalance(userId, dbClient = prisma) {
  const result = await dbClient.walletTransaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId,
    },
  });

  return result._sum.amount || 0;
}

/**
 * Appends an immutable transaction record to the user wallet ledger
 * @param {Object} txData - { userId, type: 'EARN'|'REDEEM'|'BONUS'|'ADJUST', amount, refId, note }
 * @param {Object} dbClient - optional Prisma transaction client
 */
async function recordTransaction({ userId, type, amount, refId = null, note = null }, dbClient = prisma) {
  return await dbClient.walletTransaction.create({
    data: {
      userId,
      type,
      amount,
      refId,
      note,
    },
  });
}

/**
 * Verifies whether user has sufficient ledger balance
 * @param {string} userId
 * @param {number} requiredAmount
 * @param {Object} dbClient
 * @returns {Promise<boolean>}
 */
async function hasSufficientBalance(userId, requiredAmount, dbClient = prisma) {
  const balance = await getBalance(userId, dbClient);
  return balance >= requiredAmount;
}

module.exports = {
  getBalance,
  recordTransaction,
  hasSufficientBalance,
};
