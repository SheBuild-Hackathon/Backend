const bcrypt = require("bcrypt");
const Subject = require("../models/Subject");

exports.profile = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};

exports.getName = async (req, res) => {
  const name = req.cookies["Name"];
  console.log("This is name", name);
  res.json({
    name,
  });
};

exports.passwordUpdate = async (req, res) => {
  const user = req.user;
  const saltRounds = 10;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    console.log(match);

    if (match) {
      const hash = bcrypt.hashSync(newPassword, saltRounds);
      user.password = hash;
      await user.save();
      res.json({
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};

exports.getStudentBySubjectId = async (req, res) => {
  console.log("Inside routee");
  const id = req.params.subjectId;
  try {
    const subject = await Subject.findById(id).populate(
      "students"
      //   {
      //   path: "students",
      //   populate: {
      //     path: "students",
      //     model: "Student",
      //   },
      // }
    );
    console.log(subject);
    if (!subject) {
      return res.status(404).send("No subject found");
    }
    const students = subject.students;
    res.json({
      students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
