/**
 * Credit Calculation Logic (Section 6)
 * item_credits = base_rate(category) * quantity_or_weight * condition_multiplier
 * submission_credits = sum(item_credits) + bonuses
 */

const GRADE_MULTIPLIERS = {
  A: 1.5,
  B: 1.0,
  C: 0.5,
  REJECTED: 0.0,
};

/**
 * Calculates credits for a single submission item
 * @param {Object} category - EwasteCategory record
 * @param {Object} itemData - { quantity, weightKg, grade }
 * @returns {number} credits
 */
function calculateItemCredits(category, itemData) {
  const grade = itemData.grade || 'B';
  const multiplier = GRADE_MULTIPLIERS[grade] ?? 1.0;

  if (multiplier === 0) return 0;

  const baseRate = category ? category.baseRate : 50;
  const isKg = category ? category.unit === 'PER_KG' : false;

  const factor = isKg
    ? Math.max(0.1, Number(itemData.weightKg) || 1)
    : Math.max(1, Number(itemData.quantity) || 1);

  return Math.round(baseRate * factor * multiplier);
}

/**
 * Calculates total credits for a submission including bulk and first-time bonuses
 * @param {Array} itemsWithCategories - items containing their resolved category and grading
 * @param {boolean} isFirstSubmission - whether user has prior verified submissions
 * @returns {Object} { totalCredits, itemCreditsList, bonuses: { firstBonus, bulkBonus } }
 */
function calculateSubmissionCredits(itemsWithCategories, isFirstSubmission = false) {
  let subtotal = 0;
  let totalItemUnits = 0;

  const itemCreditsList = itemsWithCategories.map((item) => {
    const credits = calculateItemCredits(item.category, item);
    subtotal += credits;
    totalItemUnits += Number(item.quantity) || 1;
    return {
      itemId: item.id,
      credits,
    };
  });

  // Calculate bonuses
  const firstSubmissionBonus = isFirstSubmission ? (Number(process.env.FIRST_SUBMISSION_BONUS) || 50) : 0;

  const bulkThreshold = Number(process.env.BULK_THRESHOLD) || 10;
  const bulkPercent = Number(process.env.BULK_BONUS_PERCENT) || 10;
  const bulkBonus = totalItemUnits >= bulkThreshold ? Math.round(subtotal * (bulkPercent / 100)) : 0;

  const totalCredits = subtotal + firstSubmissionBonus + bulkBonus;

  return {
    subtotal,
    firstSubmissionBonus,
    bulkBonus,
    totalCredits,
    itemCreditsList,
  };
}

module.exports = {
  GRADE_MULTIPLIERS,
  calculateItemCredits,
  calculateSubmissionCredits,
};
