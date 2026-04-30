const Expense = require('../models/Expense');

/**
 * POST /expenses
 * Create a new expense — idempotent via idempotencyKey
 */
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date, idempotencyKey } = req.body;

    // Idempotency check — if the same key exists, return the existing record
    if (idempotencyKey) {
      const existing = await Expense.findOne({ idempotencyKey });
      if (existing) {
        console.log(`[INFO] Duplicate request detected. idempotencyKey: ${idempotencyKey}`);
        return res.status(200).json({
          success: true,
          data: existing,
          duplicate: true,
          message: 'Expense already exists (idempotent response)',
        });
      }
    }

    const expense = new Expense({
      amount,
      category,
      description: description || '',
      date,
      idempotencyKey: idempotencyKey || undefined,
    });

    await expense.save();
    console.log(`[INFO] Expense created: ${expense._id} | $${expense.amount} | ${expense.category}`);

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /expenses
 * Fetch all expenses with optional filtering and sorting
 * Query params:
 *   - category: filter by category name
 *   - sort: "date_desc" (default) | "date_asc"
 */
const getExpenses = async (req, res, next) => {
  try {
    const { category, sort } = req.query;

    const query = {};

    // Filter by category (case-insensitive)
    if (category && category !== 'All') {
      query.category = category;
    }

    // Sort order
    const sortOption = sort === 'date_asc' ? { date: 1 } : { date: -1 };

    const expenses = await Expense.find(query).sort(sortOption).lean();

    // Compute total from returned results
    const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    // Per-category breakdown
    const categoryBreakdown = expenses.reduce((acc, e) => {
      const cat = e.category;
      acc[cat] = parseFloat(((acc[cat] || 0) + parseFloat(e.amount)).toFixed(2));
      return acc;
    }, {});

    console.log(`[INFO] GET /expenses — returned ${expenses.length} records`);

    res.json({
      success: true,
      count: expenses.length,
      total: parseFloat(total.toFixed(2)),
      categoryBreakdown,
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createExpense, getExpenses };
