const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const validateExpense = require('../middleware/validateExpense');

// POST /expenses — create a new expense
router.post('/', validateExpense, createExpense);

// GET /expenses — get all expenses with optional filter/sort
router.get('/', getExpenses);

// PUT /expenses/:id — update an expense
router.put('/:id', validateExpense, updateExpense);

// DELETE /expenses/:id — delete an expense
router.delete('/:id', deleteExpense);

module.exports = router;
