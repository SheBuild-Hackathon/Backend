const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const bcrypt = require("bcrypt");
const axios = require("axios");
const Subject = require("../models/Subject");
var cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

const teacherRegister = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    } else {
      bcrypt.hash(req.body.password, 10, async function (err, hashedPassword) {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Failed",
          });
        }

        let teacher = new Teacher({
          name: req.body.name,
          email: req.body.email,
          batch: req.body.batch,
          dob: req.body.dob,
          phn: req.body.phn,
          photo: req.body.photo,
          password: hashedPassword,
        });

        await teacher.save();

        let subjects = req.body.subName;
        for (var i = 0; i < req.body.subName.length; i++) {
          var sub = subjects[i];
          console.log("FOr", sub);
          const subject = await Subject.findOne({ subName: sub });
          if (!subject) {
            let subject = new Subject({
              subName: sub,
            });
            // console.log(subject);
            // console.log(teacher.id);

            subject.teachers.push(teacher._id);
            await subject.save();
            console.log("This is subject", subject._id);
            teacher.teachingSubs.push({
              sub: subject._id,
              subName: sub,
            });
            await teacher.save();
          } else {
            subject.teachers.push(teacher._id);
            await subject.save();
            console.log("This is subject", subject._id);
            teacher.teachingSubs.push({
              sub: subject._id,
              subName: sub,
            });
            await teacher.save();
          }
        }
      });
      res.status(200).json({
        status: "success",
        message: "Successfully registered Teacher and Saved Subject  ",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: error,
    });
  }
};

const register = async (req, res) => {
  console.log("INside ROute");
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (student) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    } else {
      bcrypt.hash(req.body.password, 10, async function (err, hashedPassword) {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Failed",
          });
        }

        let student = new Student({
          name: req.body.name,
          email: req.body.email,
          batch: req.body.batch,
          dob: req.body.dob,
          roll: req.body.roll,
          branch: req.body.branch,
          phn: req.body.phn,
          photo: req.body.photo,

          password: hashedPassword,
        });

        await student.save();

        let subjects = req.body.subName;

        for (var i = 0; i < req.body.subName.length; i++) {
          var sub = subjects[i];
          console.log("FOr", sub);
          const subject = await Subject.findOne({ subName: sub });
          if (!subject) {
            let subject = new Subject({
              subName: sub,
            });
            console.log(subject);
            console.log(student.id);

            subject.students.push(student._id);
            await subject.save();
            console.log("This is subject", subject._id);
            student.attendance.push({
              sub: subject._id,
              totalPresent: 0,
              totalDays: 0,
              isActive: false,
              isMarked: false,
              subName: sub,
            });
            console.log(student.attendance);
            await student.save();
          } else {
            subject.students.push(student._id);
            await subject.save();
            console.log("This is subject", subject._id);
            student.attendance.push({
              sub: subject._id,
              totalPresent: 0,
              totalDays: 0,
              isActive: false,
              isMarked: false,
              subName: sub,
            });
            await student.save();
            console.log(student.attendance);
          }
        }

        res.status(200).json({
          status: "success",
          message: "Successfully registered Student and Saved Subject  ",
        });
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Failure to regiter",
      message: error,
    });
  }
};

// var getName;

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  Student.findOne({ email: email }).then(async (student) => {
    if (student) {
      bcrypt.compare(password, student.password, async (err, result) => {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Some error occured",
          });
        }
        if (result) {
          var token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
            expiresIn: "2d",
          });
          console.log("The is student naem", student.name);
          process.env.getName = student.name;

          res.status(200).json({
            status: "success",
            message: "Logged In successfully",
            token,
          });
        } else {
          res.status(400).json({
            status: "error",
            message: "Credentials Not Correct",
          });
        }
      });
    } else {
      console.log("Inside Else");
      const teacher = await Teacher.findOne({ email });
      if (!teacher) {
        return res.status(404).json({
          message: "Email Id is Invalid",
        });
      }
      bcrypt.compare(password, teacher.password, (err, result) => {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Some error occured",
          });
        }
        if (result) {
          var token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, {
            expiresIn: "2h",
          });
          process.env.getName = teacher.name;
          process.env.id = teacher._id;
          res.status(200).json({
            status: "success",
            message: "Logged In successfully as A Teacher",
            token,
          });
        } else {
          res.status(400).json({
            status: "error",
            message: "Credentials Not Correct",
          });
        }
      });
    }
  });
};

/* ----------------------- DashBoard Protection Route ----------------------- */

const authPass = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log("Inside If of auth Pass");
    // console.log(req.headers.authorization);
    // console.log(req.headers.authorization.startsWith("Bearer"));

    token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(400).json({
      message: "You aren't Logged In",
    });
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log("This is decoded", decoded);

  // 3) Check if user still exists
  const currentUser = await Student.findById(decoded.id);

  if (!currentUser) {
    const currentTeacher = await Teacher.findById(decoded.id);
    if (currentTeacher) {
      req.user = currentTeacher;
      res.locals.user = currentTeacher;
      return next();
    } else {
      return res.status(404).json({
        message: "You aren't Logged In",
      });
    }
  }

  // 4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTE

  req.user = currentUser;
  // console.log("This is req.user from middlwwRE", req.user);
  res.locals.user = currentUser;
  console.log("Successfully Passed Middlware");
  next();
};

module.exports = {
  register,
  login,
  authPass,
  teacherRegister,
};
