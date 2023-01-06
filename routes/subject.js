const express = require("express");
const Subject = require("../models/Subject.js");
const Teacher = require("../models/Teacher");

const router = express.Router();

router.get("/", async (req, res) => {
  const subjects = await Subject.find()
    .populate("students")
    .populate("teachers");
  res.json({ subjects });
});

router.post("/getSubject", async (req, res) => {
  const subjectId = req.body.subjectId;
  const subject = await Subject.findById(subjectId)
    .populate("students")
    .populate("teachers");
  if (subject) {
    res.json({ subject });
  } else {
    res.json({ message: "Subject not found" });
  }
});

router.post("/getLivelink", async (req, res) => {
  const subjectId = req.body.subjectId;
  const subject = await Subject.findById(subjectId);
  if (subject) {
    const id = subject.teachers[0];
    const teacher = await Teacher.findById(id);
    console.log(teacher)
    if (teacher && teacher.link) {
      const Link = teacher.link;
      res.json({ Link });
    } else {
      res.json({ message: "No link found" });
    }
  } else {
    res.json({ message: "Subject not found" });
  }
});

module.exports = router;
