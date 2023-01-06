const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const Class = require("../../models/class.model");
const Classwork = require("../../models/classwork.model");
const { nanoid } = require("nanoid");
const { authPass } = require("../../controller/authController");

router.post("/create",authPass, async (req, res) => {
  const { title, description, classId, type, duedate, options } = req.body;
    const teacher = req.user
    console.log(req.user)
    if (!teacher) 
    {
      res.status(404).json("Teacher not found.");
    }
    else {
      const c = await Class.findOne({ _id: classId })
        if (!c) 
        {
          res.status(404).json("Class not found.");
        }
        else {
          const newClasswork = new Classwork({
            title,
            description,
            class:c,
            types: type,
            duedate,
            options,
            author: teacher,
          });
          const saved = await newClasswork.save()
          if(saved){
            res.json({ message: "Classwork created.", id: newClasswork._id })
          }
          else{
            res.status(400).json("Error: ")
          }
        }
    }
  });

router.get("/class/get/:class",authPass, async (req, res) => {
  const classId = req.params.class;
  const c = Class.findOne({ _id: classId }) 
    if (!c)
    {
      res.status(404).json("Class not found.");
    }
    else {
      const classwork = await Classwork.find({ class: classId }).populate("author").sort({ _id: -1 })
      if (classwork){
        res.status(200).json(classwork)
      }
      else{
        res.status(500).json("Something went wrong.")
      }
    }
});

router.get("/get/:classwork",authPass,  async (req, res) => {
  const classwork = req.params.classwork;
  const cw = await Classwork.findById(classwork)
  if(cw){
    res.json(cw)
  }
  else{
    res.status(404).json("Classwork not found.")
  }
})

router.patch("/update/:classwork",authPass, async (req, res) => {
  const { title, description, duedate, type, options} = req.body;
  const id = req.params.classwork;
  const classwork = await Classwork.findById(id)
  console.log(classwork)
    if (!classwork) 
    {
      res.status(404).json("Classwork not found.");
    }
    else {
      const teacher = req.user
        if (!teacher)
        {
          res.status(403).json("Permission denied.");
        }
        else {
          classwork.title = title;
          classwork.description = description;
          classwork.duedate = duedate;
          classwork.type = type;
          classwork.options = options;
          const saved = classwork.save()
          if(saved){
            res.json({ message: "Success", classwork })
          }
          else{
            res.status(400).json("Error: ")
          }
        }
    }
});

router.delete("/delete/:classwork",authPass, async (req, res) => {
  const teacher = req.user
  const id = req.params.classwork;
  console.log(id)
  if(!teacher){
    res.status(403).json("Permission denied.");
  }
  else {
      const cw = await Classwork.findByIdAndRemove(id)
      // console.log(cw)
        if(cw) res.json("Successfully deleted classwork")
        else res.status(400).json("Error: ")
    }
  });

router.post("/submit/answer",authPass, async (req, res) => {
  const { answer, classwork} = req.body;
  const student = req.user

  if(!student){
    res.status(403).json("Permission denied.");
  }
    else {
      const cw = await Classwork.findOne({ _id: classwork })
        if (!cw) res.status(404).json("Classwork not found.");
        else {
          let response = {
            _id: nanoid(20),
            student,
            answer,
            answeredOn: new Date(),
          };
          cw.answer.push(response);
          const saved = cw.save()
          if(saved){
            res.json({ message: "Success", answers: cw.answer })
          }
          else res.status(400).json("Error: " )
        }
      }
    });

router.get("/get/answer/:classwork",authPass, async  (req, res) => {
  const classworkId = req.params.classwork;
  const cw = await Classwork.findById(classworkId) 

  if(!cw){
    res.status(404).json("Classwork not found.");
  }
    else res.json(cw.answer);
  });

module.exports = router;
