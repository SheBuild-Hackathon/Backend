const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  role: {
    type: String,
    default: "admin",
  },
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
  batch: String,
  dob: String,
  phn: String,
  photo: String,
  link: String,
  teachingSubs: [
    {
      sub: {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
      subName: String,
    },
  ],
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
