const Teacher = require('../models/Teacher')
const Subject = require('../models/Subject')
const Vlab = require('../models/vlab')

exports.profile = (req, res) => {
  try {
    console.log("INside route");
    const user = req.user;
    if (!user) {
      return res.status(404).send("Teacher Not Found");
    }

    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};

exports.getAll = async(req,res) => {
  try{
    let t = await Teacher.find({},{name:1});
    let s = await Subject.find({},{subName:1});

    let subjects=[],teachers=[];

    for(let i=0;i<s.length;i++){
      subjects.push(s[i].subName);
    }
    for(let i=0;i<t.length;i++){
      teachers.push(t[i].name);
    }

    console.log(teachers);

    let classes = ['CSE','IT']
    return res.status(200).json({
      teachers,
      subjects,
      classes
    })
  }catch(err){
    res.status(err)
  }
}

exports.newVlab = async(req,res) => {
  try {
    const vlab = await Vlab.create(req.body);
    if(vlab){
      return res.status(200).json({
        message:"New Lab made"
      })
    }else{
      return res.status(400).json({
        message:"Error occured"
      })
    }
  } catch (error) {
    return res.status(400).json({
      error: error
    })
  }
}

exports.vlab = async(req,res) => {
  try {
    const vlab = await Vlab.find();
    console.log(vlab);
    const subjects = await Vlab.find().distinct("subject");
    console.log(subjects);
    return res.status(200).json({
      data: vlab,
      subjects
    })
  } catch (error) {
    return res.status(400).json({
      error: error
    })
  }
}