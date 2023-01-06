const Conversation = require("../models/conversation");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { authPass } = require("../controller/authController");

const router = require("express").Router();

//new conv

router.get("/getStudents/:userId", async (req, res) => {
  const students = await Student.find();
  console.log("All teachers", students);
  const conversation = await Conversation.find({
    members: { $in: [req.params.userId] },
  });
  var fullPremiumData = [];
  //   console.log("This is Conversation of the user", conversation);
  for (var i = 0; i < conversation.length; i++) {
    const convo = conversation[i];

    const studentId = convo.members[0];

    console.log("Before", fullPremiumData);
    const student = await Student.findOne({ _id: studentId });
    console.log("Student", student);
    var data = {
      teacher: student,
      convoId: convo._id,
    };
    fullPremiumData.push(data);
    //   console.log("This is fulldata", fullPremiumData);
  }

  res.json({
    message: "Success",
    data: fullPremiumData,
  });
});

router.get("/getTeachers/:userId", async (req, res) => {
  const teachers = await Teacher.find();
  console.log("All teachers", teachers);
  const conversation = await Conversation.find({
    members: { $in: [req.params.userId] },
  });
  var fullPremiumData = [];

  for (var i = 0; i < teachers.length; i++) {
    const t = teachers[i];
    var data = {
      teacher: t,
      convoId: "",
    };
    fullPremiumData.push(data);
  }
  //   console.log("This is Conversation of the user", conversation);
  for (var i = 0; i < conversation.length; i++) {
    const convo = conversation[i];

    const teacherId = convo.members[1];

    for (var j = 0; j < fullPremiumData.length; j++) {
      const t = fullPremiumData[j];
      if (t.teacher._id == teacherId) {
        t.convoId = convo._id;
      }
    }
    console.log("Before", fullPremiumData);

    //   console.log("This is fulldata", fullPremiumData);
  }
  if (teachers.length == 0) {
    return res.send("No Teacher Found");
  }

  res.json({
    message: "Success",
    data: fullPremiumData,
  });
});

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  console.log(req.params.userId);
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/get/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const student = await Student.findById(id);
    if (!student) {
      const teacher = await Teacher.findById(id);
      return res.status(200).json({ teacher });
    }
    res.status(200).json({ student });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/getAllConversation", authPass, async (req, res) => {
  var conversations = [];
  console.log("inside getAllConversation");
  const user = req.user;
  console.log(user);
  const conversation = await Conversation.find();
  console.log("This is all conversations", conversation);

  conversation.forEach((convo) => {
    console.log("This is Convo", convo);
    convo.members.forEach((member) => {
      console.log("This is Member", JSON.stringify(member));
      console.log(JSON.stringify(user._id));
      if (JSON.stringify(member) == JSON.stringify(user._id)) {
        console.log("inside if");
        conversations.push(convo._id);
      }
    });
  });
  console.log(conversations);
  if (!conversation) {
    return res.status(404).send("Not found");
  }
  res.status(200).json({ conversations });
});

module.exports = router;
