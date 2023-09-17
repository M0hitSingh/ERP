const mongoose = require("mongoose");
const schema = mongoose.Schema;

const resultSchema = new schema({
  student:{
    type:schema.Types.ObjectId,
    ref:"student"
  },
  scores:[{
    sem: Number,
    exam: String,
    subject: String,
    score: Number,
    maxmarks:Number
  }],
  percentage:{
    type:Number
  }
})

module.exports = mongoose.model("result",resultSchema);