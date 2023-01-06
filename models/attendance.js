const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema({
  name: String,
  noStudent: Number,
  teachers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Teacher,
  },
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student,
  },
});

const User = mongoose.model("Batch", batchSchema);

module.exports = User;
