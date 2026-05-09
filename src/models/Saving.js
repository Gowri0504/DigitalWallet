const mongoose = require("mongoose");

const SavingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Saving", SavingSchema);
