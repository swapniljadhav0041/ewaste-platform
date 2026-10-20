const assert = require('assert');
const { calculateItemCredits, calculateSubmissionCredits, GRADE_MULTIPLIERS } = require('../src/services/creditService');

console.log('🧪 Running Credit Service Unit Tests...');

// Test 1: Grade multipliers for item
const phoneCategory = { id: 'c1', name: 'Phones', baseRate: 120, unit: 'PER_ITEM' };

const testGradeA = calculateItemCredits(phoneCategory, { quantity: 1, grade: 'A' });
assert.strictEqual(testGradeA, 180, 'Grade A (1.5x of 120) should be 180');
console.log('  ✓ Grade A multiplier test passed (120 * 1.5 = 180)');

const testGradeB = calculateItemCredits(phoneCategory, { quantity: 1, grade: 'B' });
assert.strictEqual(testGradeB, 120, 'Grade B (1.0x of 120) should be 120');
console.log('  ✓ Grade B multiplier test passed (120 * 1.0 = 120)');

const testGradeC = calculateItemCredits(phoneCategory, { quantity: 1, grade: 'C' });
assert.strictEqual(testGradeC, 60, 'Grade C (0.5x of 120) should be 60');
console.log('  ✓ Grade C multiplier test passed (120 * 0.5 = 60)');

const testGradeRejected = calculateItemCredits(phoneCategory, { quantity: 1, grade: 'REJECTED' });
assert.strictEqual(testGradeRejected, 0, 'Grade REJECTED should be 0');
console.log('  ✓ Grade REJECTED multiplier test passed (0 credits)');

// Test 2: PER_KG Category
const pcbCategory = { id: 'c2', name: 'PCBs', baseRate: 80, unit: 'PER_KG' };
const testKg = calculateItemCredits(pcbCategory, { weightKg: 2.5, grade: 'B' });
assert.strictEqual(testKg, 200, '2.5 kg at 80/kg Grade B should be 200 credits');
console.log('  ✓ PER_KG calculation test passed (2.5kg * 80 = 200)');

// Test 3: Submission with first-time bonus (+50)
const items = [
  { id: 'item-1', category: phoneCategory, quantity: 1, grade: 'B' }, // 120
  { id: 'item-2', category: pcbCategory, weightKg: 1, grade: 'B' }    // 80
];
const firstSubResult = calculateSubmissionCredits(items, true);
assert.strictEqual(firstSubResult.subtotal, 200, 'Subtotal should be 200');
assert.strictEqual(firstSubResult.firstSubmissionBonus, 50, 'First time bonus should be 50');
assert.strictEqual(firstSubResult.totalCredits, 250, 'Total credits with first-time bonus should be 250');
console.log('  ✓ First-time recycling bonus test passed (200 + 50 = 250)');

// Test 4: Bulk submission bonus (>= 10 items gets +10%)
const bulkItems = [
  { id: 'item-bulk', category: phoneCategory, quantity: 10, grade: 'B' } // 10 * 120 = 1200
];
const bulkResult = calculateSubmissionCredits(bulkItems, false);
assert.strictEqual(bulkResult.subtotal, 1200, 'Subtotal should be 1200');
assert.strictEqual(bulkResult.bulkBonus, 120, 'Bulk bonus (10% of 1200) should be 120');
assert.strictEqual(bulkResult.totalCredits, 1320, 'Total should be 1320');
console.log('  ✓ Bulk submission bonus test passed (1200 + 10% = 1320)');

console.log('🎉 All Credit Service unit tests passed successfully!\n');
