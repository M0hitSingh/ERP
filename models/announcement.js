const mongoose = require("mongoose");
const schema = mongoose.Schema;

const announcementSchema = new schema({
  date:String,
  time:String,
  description:String,
  annfor:String,
  madeby:String
},{
  timestamps: true
})

module.exports = mongoose.model("announcement",announcementSchema);