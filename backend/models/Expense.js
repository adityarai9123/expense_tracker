const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid type. Must be income or expense',
      },
      default: 'expense',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
      set: (v) => parseFloat(parseFloat(v).toFixed(2)), // Store with 2 decimal precision
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Utilities', 'Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    // Idempotency key to prevent duplicate submissions
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true, // allows multiple documents without this field
      index: true,
    },
  },
  {
    timestamps: true, // auto-creates createdAt and updatedAt
  }
);

// Index for common queries
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1, date: -1 });
expenseSchema.index({ type: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
