const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  subName: String,
  noStudent: Number,
  isStart: Boolean,
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
