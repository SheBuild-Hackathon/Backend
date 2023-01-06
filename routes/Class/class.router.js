const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const Class = require("../../models/class.model");
const { nanoid } = require("nanoid");
const { authPass } = require("../../controller/authController");

router.get("/get/class/:classId", (req, res) => {
  const classId = req.params.classId;
  Class.findById(classId)
    .populate("students")
    .then((_class) => res.json(_class))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.get("/get/created/:user", (req, res) => {
  const user = req.params.user;
  Class.find({ owner: user })
    .then((classes) => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.get("/get/taught/:user", (req, res) => {
  const user = req.params.user;
  Class.find({ teacher: { $in: [user] } })
    .then((classes) => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.get("/get/studied/:user", (req, res) => {
  const user = req.params.user;
  Class.find({ students: { $in: [user] } })
    .then((classes) => res.json(classes))
    .catch(() => res.status(400).json("Something went wrong"));
});

router.get("/getAllCLass", authPass, async (req, res) => {
  const user = req.user;
  if (user.role == "admin") {
    const classes = await Class.find({ owner: { $in: [user] } });

    if (!classes) {
      return res.status(404).json({
        message: "No classes found",
      });
    }

    res.status(201).json({
      message: "Classes for teacher ",
      classes,
    });
  } else {
    const classes = await Class.find({
      students: { $in: [user] },
    });
    // const classes = await Class.find();

    if (!classes) {
      return res.status(404).json({
        message: "No classes found",
      });
    }

    res.status(201).json({
      message: " All Classes for student ",
      classes,
    });
  }
});

router.post("/");

router.post("/create", authPass, async (req, res) => {
  console.log("This is inside controller", req.user);
  const teacher = req.user;
  console.log("This is teacher", teacher);
  const { title, description } = req.body;
  console.log("This is body", req.body);
  try {
    if (!teacher) {
      return res.status(400).json("User not found");
    } else {
      const _class = new Class({
        title,
        description,
        owner: teacher._id,
        code: nanoid(11),
      });

      await _class.save();
      res.status(201).json({
        message: "Success",
        classId: _class._id,
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/students/register", authPass, async (req, res) => {
  try {
    const teacher = req.user;
    const { classId, studentEmail } = req.body;
    console.log("studentId", studentEmail);
    const student = await Student.findOne({ email: studentEmail });
    console.log(student._id);
    // console.log(classId)
    if (!teacher) {
      return res.status(403).json("U arent logged in.");
    }
    if (!student) {
      return res.status(500).json("Something went wrong.");
    } else {
      const CClass = await Class.findById(classId);
      if (!CClass) {
        res.status(400).json("Class not found.");
      } else {
        if (CClass.students.includes(student._id)) {
          return res
            .status(400)
            .json("The Student  already has a role in this class.");
        }
        CClass.students.push(student._id);
        await CClass.save();

        res.json({ message: "Success", class: CClass });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/students/delete", authPass, async (req, res) => {
  const teacher = req.user;

  const { classId, studentId } = req.body;
  const student = await Student.findById(studentId);
  console.log(student);

  if (!student) {
    return res.status(403).json("Student not found");
  }

  const CClass = await Class.findById(classId);
  console.log(CClass);

  if (!CClass) {
    return res.status(400).json("Class not found.");
  }

  if (CClass.students.includes(student._id)) {
    console.log("Found Id");
    for (let i = 0; i < CClass.students.length; i++) {
      console.log(CClass.students[i]);
      console.log(student._id);
      if (CClass.students[i].equals(student._id)) {
        console.log("Inside If OF For Loop");
        CClass.students.splice(i, 1);
        i--;
      }
    }
  }
  await CClass.save();

  res.json({
    message: "Success",
    data: CClass,
  });
});

router.patch("/update", authPass, async (req, res) => {
  const teacher = req.user;
  const { classId, title, description } = req.body;
  console.log("Req.BOdy is", req.body);

  if (!teacher) {
    return res.status(403).json("Permission denied.");
  } else {
    const CClass = await Class.findById(classId);
    if (!CClass) {
      return res.status(400).json("Class not found.");
    } else {
      CClass.title = title;
      CClass.description = description;
      CClass.save()
        .then(() => res.json("Success."))
        .catch(() => res.status(400).json("Something went wrong."));
    }
  }
});

module.exports = router;
