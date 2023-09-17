const mongoose = require("mongoose");
const schema = mongoose.Schema;

const attendanceSchema = new schema({
  student:{
    type:schema.Types.ObjectId,
    ref:"student"
  },

  semWiseAtt:[{
    sem:Number,

    attendance:[{
      subject:{
        type:schema.Types.ObjectId,
        ref:'subject'
      },     
      P:[Date],
      A:[Date]
    }],
  }]
})

module.exports = mongoose.model("attendance",attendanceSchema);