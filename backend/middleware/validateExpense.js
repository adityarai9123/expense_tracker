const VALID_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const VALID_TYPES = ['income', 'expense'];

/**
 * Validates incoming expense/income creation requests
 * Returns 400 with descriptive errors on failure
 */
const validateExpense = (req, res, next) => {
  const { amount, category, date, type } = req.body;
  const errors = [];

  // Type validation
  if (type && !VALID_TYPES.includes(type)) {
    errors.push('Type must be either "income" or "expense"');
  }

  // Amount validation
  if (amount === undefined || amount === null || amount === '') {
    errors.push('Amount is required');
  } else {
    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      errors.push('Amount must be a valid number');
    } else if (numAmount <= 0) {
      errors.push('Amount must be greater than 0');
    } else if (numAmount > 1_000_000) {
      errors.push('Amount cannot exceed 1,000,000');
    }
  }

  // Category validation
  if (!category || category.trim() === '') {
    errors.push('Category is required');
  } else if (!VALID_CATEGORIES.includes(category.trim())) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  // Date validation
  if (!date) {
    errors.push('Date is required');
  } else if (isNaN(Date.parse(date))) {
    errors.push('Date must be a valid date');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = validateExpense;
