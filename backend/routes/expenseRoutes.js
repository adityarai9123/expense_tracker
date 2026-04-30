const express = require('express');
const router = express.Router();
const { createExpense, getExpenses } = require('../controllers/expenseController');
const validateExpense = require('../middleware/validateExpense');

// POST /expenses — create a new expense
router.post('/', validateExpense, createExpense);

// GET /expenses — get all expenses with optional filter/sort
router.get('/', getExpenses);

module.exports = router;
