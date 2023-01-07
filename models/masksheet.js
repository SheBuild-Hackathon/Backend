const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marksheetSchema = new Schema({
  rollno:{
    type:String
  },
  name:{
    type:String
  },
  branch:{
    type:String
  },
  semester:{
    type:String
  },
  sgpa:{
    type:String
  },
  attendance:{
    type:String
  },
  percentage:{
    type:String
  },
  compiler:{
    type:String
  },
  oops:{
    type:String
  },
  electronics:{
    type:String
  },

});

const User = mongoose.model("Marksheet", marksheetSchema);

module.exports = User;
