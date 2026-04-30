const Expense = require('../models/Expense');

/**
 * POST /expenses
 * Create a new expense/income — idempotent via idempotencyKey
 */
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date, idempotencyKey, type } = req.body;

    // Idempotency check
    if (idempotencyKey) {
      const existing = await Expense.findOne({ idempotencyKey });
      if (existing) {
        console.log(`[INFO] Duplicate request detected. idempotencyKey: ${idempotencyKey}`);
        return res.status(200).json({
          success: true,
          data: existing,
          duplicate: true,
          message: 'Record already exists (idempotent response)',
        });
      }
    }

    const expense = new Expense({
      type: type || 'expense',
      amount,
      category,
      description: description || '',
      date,
      idempotencyKey: idempotencyKey || undefined,
    });

    await expense.save();
    console.log(`[INFO] ${expense.type} created: ${expense._id} | $${expense.amount} | ${expense.category}`);

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /expenses
 * Fetch all records with optional filtering and sorting
 * Query params:
 *   - category: filter by category name
 *   - type: filter by "income" or "expense"
 *   - sort: "date_desc" (default) | "date_asc"
 */
const getExpenses = async (req, res, next) => {
  try {
    const { category, sort, type } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (type && type !== 'all') {
      query.type = type;
    }

    const sortOption = sort === 'date_asc' ? { date: 1 } : { date: -1 };
    const records = await Expense.find(query).sort(sortOption).lean();

    // Separate income and expense totals
    let totalIncome = 0;
    let totalExpense = 0;

    const categoryBreakdown = {};
    const monthlyBreakdown = {};

    records.forEach((r) => {
      const amt = parseFloat(r.amount);

      if (r.type === 'income') {
        totalIncome += amt;
      } else {
        totalExpense += amt;
      }

      // Category breakdown
      const cat = r.category;
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { income: 0, expense: 0, total: 0 };
      }
      categoryBreakdown[cat][r.type] += amt;
      categoryBreakdown[cat].total += amt;

      // Monthly breakdown
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyBreakdown[key]) {
        monthlyBreakdown[key] = { income: 0, expense: 0 };
      }
      monthlyBreakdown[key][r.type] += amt;
    });

    // Round values
    totalIncome = parseFloat(totalIncome.toFixed(2));
    totalExpense = parseFloat(totalExpense.toFixed(2));
    const netBalance = parseFloat((totalIncome - totalExpense).toFixed(2));

    console.log(`[INFO] GET /expenses — returned ${records.length} records`);

    res.json({
      success: true,
      count: records.length,
      totalIncome,
      totalExpense,
      netBalance,
      total: parseFloat((totalIncome + totalExpense).toFixed(2)),
      categoryBreakdown,
      monthlyBreakdown,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /expenses/:id
 * Update an existing record
 */
const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date, type } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    if (type !== undefined) expense.type = type;
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date !== undefined) expense.date = date;

    await expense.save();
    console.log(`[INFO] ${expense.type} updated: ${expense._id} | $${expense.amount} | ${expense.category}`);

    res.json({ success: true, data: expense });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /expenses/:id
 * Delete a record
 */
const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }

    console.log(`[INFO] ${expense.type} deleted: ${id} | $${expense.amount} | ${expense.category}`);

    res.json({ success: true, data: expense, message: 'Record deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };
