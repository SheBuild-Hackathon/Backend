const express = require("express");
const { authPass } = require("../controller/authController");
const {
  profile,
  passwordUpdate,
  getStudentBySubjectId,
  getName,
} = require("../controller/studentController");
const router = express.Router();
const {
  markAttendance,
  daysTotal,
  disabled,
  classStart,
} = require("../controller/attendance");

router.get("/setCookie", (req, res) => {
  console.log("CookieRouter");
  const x = 12;
  res.cookie("X", x, {
    domain: ".class-hub-backend.herokuapp.com",
    path: "/liveClass",
    httpOnly: true,
  });

  res.json({
    msg: "ss",
  });
});
router.get("/", authPass, profile);
router.get("/getName", getName);
router.post("/updatePassword", authPass, passwordUpdate);
router.post("/mark", authPass, markAttendance);
router.post("/dayTotal", authPass, daysTotal);
router.post("/attendanceDisabled", authPass, disabled);
router.post("/getStudent/:subjectId", authPass, getStudentBySubjectId);
router.post('/classStart',authPass, classStart )

module.exports = router;
