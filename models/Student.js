const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roll: String,
  batch: String,
  branch: String,
  dob: String,
  phn: String,
  photo: String,
  attendance: [
    {
      sub: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      totalPresent: Number,
      totalDays: Number,
      isActive: Boolean,
      isMarked: Boolean,
      subName: String,
      expDate: String,
      expDateClass: String,
      isClassStart: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
