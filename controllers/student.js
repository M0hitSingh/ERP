const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const { validationResult } = require('express-validator');
const Attendance = require("../models/attendance");
const Announcement = require("../models/announcement")
const Result = require("../models/result");
const Batch = require("../models/batch");

//to view attendance
exports.viewAttendance = async(req,res,next)=>{
  try{
    const studentid = req.params.student;
    const array=[];
    // const student = await Student.findById(studentid);
    // console.log(student)
    const attobj = await Attendance.findOne({student:studentid}).populate('student semWiseAtt.attendance.subject');
    // console.log(attobj) 
    if(attobj == null)
      {
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      else{
        var pr=0,ab=0;
        attobj.semWiseAtt.filter(att=>{
              if(att.sem == parseInt(attobj.student.sem))
              {
                // console.log(att) 
                att.attendance.forEach(a=>{
                  object={
                    subject: a.subject.code,
                    present:a.P,
                    absent:a.A,
                    noOfP:a.P.length,
                    per:((a.P.length*100)/(a.P.length+a.A.length)).toFixed(1)
                  }
                  pr+=a.P.length;
                  ab+=a.P.length+a.A.length;
                  array.push(object);
                })
               array.push({totalpresent:pr,totalpercent:((pr*100)/(pr+ab)).toFixed(1)});
              }
            });
      }
  return res.status(201).json(array);
}
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}

//to view result
exports.viewResult = async(req,res,next)=>{
  try{
    const userid = req.params.student;
    // const userid = req.userId;
    const result = await Result.findOne({student:userid}).populate('student','sem');
    const sem  = parseInt(result.student.sem);
      if(result == null)
      {
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      else
      {
        var array=[];
        var totsco =0;
        var maxsco =0;
        for(var i=1;i<=sem;i++)
        {
          var totsco =0;
          var maxsco =0; 
          // console.log(sem,result.scores)
           result.scores.filter(sco=>{
            if(sco.sem == i)
              {
                totsco+=sco.score;
                maxsco+=sco.maxmarks;
              }
          });
          const per = (totsco*100)/maxsco;
          obj={
            sem:i,
            marks:totsco,
            total:maxsco,
            percent:per.toFixed(1)
          }
          array.push(obj);
        }
        return res.status(201).json(array);
      }
}
catch(err){
  if(!err.statusCode)
  err.statusCode = 500;
  next();
}
}

//to view marks per subject per exam per sem
exports.viewResultExamwise = async(req,res,next)=>{
  try{
    const userid = req.params.student;
    const {sem,exam} = req.query;
    const result = await Result.findOne({student:userid});
      if(result == null)
      {
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      else
      {
        var array=[];
        result.scores.filter(sco=>{
        if(sco.sem == sem && sco.exam==exam)
        {
          obj={
            marks:sco.score,
            subject:sco.subject,
          }
          array.push(obj);    
          }});
          
        return res.status(201).json(array);
      }
}
catch(err){
  if(!err.statusCode)
  err.statusCode = 500;
  next();
}
}


exports.viewAnnouncement= async (req,res,next)=>{
  try{
    const user = req.query.user; 
    if(user=="admin")
    {
      const ann = await Announcement.find({}).sort({createdAt:-1})
      return res.status(201).json(ann);
    }
    const ann = await Announcement.find({$or:[
      {annfor:user},
      {annfor:"both"}
    ]}).sort({createdAt:-1})
    return res.status(201).json(ann);
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}