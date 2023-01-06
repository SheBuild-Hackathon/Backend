const mongoose = require("mongoose");

const vlabSchema = mongoose.Schema({
    subject:{
        type: String,
        required: true
    },
    experiments:[{
        title:{
            type:String,
            required: true
        },
        aim:{
            type:String,
            required: true
        },
        theory:{
            type:String,
            required: true
        },
        pretest:{
            type:String,
            required: true
        },
        posttest:{
            type:String,
            required: true
        },
        simulation:{
            type:String,
            required: true
        }
    }]
});

module.exports = mongoose.model("Vlab", vlabSchema);
