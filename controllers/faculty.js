const Student = require("../models/student");
const Faculty = require("../models/faculty");
const Branch = require("../models/branch");
const Exam = require("../models/exam");
const Subject = require("../models/subject");
const { validationResult } = require('express-validator');
const Attendance = require("../models/attendance");
const Result = require("../models/result");
const Batch = require("../models/batch");
const Announcement = require("../models/announcement")
const  excelToJson = require("convert-excel-to-json");

exports.addAttendance = async (req,res,next)=>{
  try{
    const {sem,arrayP,date,subject,arrayA} = req.body;
    for(var i=0;i<arrayP.length;i++)
    {
    //  const obj ={ date: date, subject: subject, AorP:'P'};
     const updateattendance=await Attendance.findOneAndUpdate({ student:arrayP[i]},{},{upsert:true, new: true})
     const index = updateattendance.semWiseAtt.findIndex((att=>att.sem == sem))
     if(index== -1)
     {
      updateattendance.semWiseAtt.push({sem:sem})
     }
     const attobj = updateattendance.semWiseAtt.find(att=>(att.sem == sem));
     const subindex = attobj.attendance.findIndex(att=>(att.subject == subject))
     if(subindex== -1)
     {
      attobj.attendance.push({subject:subject})
     }
     const subatt = attobj.attendance.find(att=>(att.subject == subject))
     subatt.P.push(date);
    //  attobj.attendance.push(obj);
     // console.log(updateattendance);
      await updateattendance.save();
    }
    for(var i=0;i<arrayA.length;i++)
    {
      const obj ={ date: date, subject: subject, AorP:'A'};
       const updateattendance=await Attendance.findOneAndUpdate(
         { student:arrayA[i]},
         {$push:{ "attendance" : [obj]}},
         {
           upsert:true
         }
      );
        updateattendance.totalpercent = (updateattendance.totalP/(updateattendance.attendance.length+1))*100;
        console.log(updateattendance.totalP,updateattendance.attendance.length)
        await updateattendance.save();
     }

    res.status(201).json({message:"Attendance updated"});
  }
  catch(err){
    if(!err.statusCode)
      err.statusCode=500;
    next();
  }
}


exports.addresults = async(req,res,next)=>{
  try{
    const {sem,exam,subject,array,maxmarks} = req.body;
    // if(1)
    // {
          // const f = req.body.file;
          // const sheet = excelToJson({
          // sourceFile: f,
          // // Header Row -> be skipped and will not be present at our result object.
          // header:{
          //         rows: 1
          //     },
          // // Mapping columns to keys
    //           columnToKey: {
    //             A: 'rollno',
    //             B: 'name',
    //             C: 'score'
    //             }
    //           }
    //       );
    
    // const array = sheet.Marks;
    // // }
    for(var i=0;i<array.length;i++)
    {
     // const stu = await Student.findOne({rollno:array[i].rollno});
      const updateresult = await Result.findOneAndUpdate(
        { student:array[i].student},
        { $push:{ "scores":[{ sem: sem, exam: exam, subject: subject, score: array[i].score,maxmarks:maxmarks}]}},
        { upsert:true}
      )
    }
    res.status(201).json({message:"result updated"});
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode =500;
    next();
  }
}




exports.viewScores = async(req,res,next)=>{
  try{
    const batchid = req.params.batch;
    const sub = req.params.sub;
    const batch = await Batch.findById(batchid).populate('students');
    // console.log(batch);
    const array=[];
    await Promise.all(batch.students.map(async (i) => {
      const results = await Result.findOne({student:i});
      if(results == null)
      {
        const err = new Error('No record found');
        err.statusCode = 400;
        throw err;
      }
      
      else{
      // console.log(results)
      results.scores.filter(sco=>{
        if(sco.subject == sub && sco.sem == i.sem)
          {
            obj ={
              student:i._id,
              sem: sco.sem,
              exam: sco.exam,
              subject: sco.subject,
              score: sco.score 
            }
            array.push(obj);
          }
      });
    }
    }))
    return res.status(201).json(array);
  }
  catch(err){
    if(!err.statusCode)
    err.statusCode = 500;
    next();
  }
}


exports.makeAnnouncements = async(req,res,next)=>{
  try{
    const {announcement,date,annfor,time}=req.body;
    const id = req.params.id;
    const ann = new Announcement({
      date: date,
      time:time,
      description:announcement,
      annfor:annfor
    }) 
    await ann.save();
    const fac = await Faculty.findByIdAndUpdate(id,{
      $push:{
        announcement: ann,
        $sort: { createdAt : -1 },
     }}
    )
    ann.madeby=fac.fullname;
    await ann.save();
    return res.status(201).json("done");
  }
  catch(err){
    if(!err.statusCode) 
    err.statusCode = 500; 
    next();
  }
} 

exports.deleteAnnouncements = async(req,res,next)=>{
  try{
    const annid=req.params.annid;
    const facid = req.params.facid
    const ann = await Announcement.findByIdAndRemove(annid);
    const fac = await Faculty.findOneAndUpdate(
      {_id:facid},
      {$pull:{ announcement: annid }}
    )
    return res.status(202).json("deleted");
  }
  catch(err){
    if(!err.statusCode) 
    err.statusCode = 500; 
    next();
  }
} 

exports.viewyourann = async(req,res,next)=>{
  try{
    const id = req.params.id;
    const fac = await Faculty.findById(id).populate('announcement');
    return res.status(202).json({ann:fac.announcement});
  }
  catch(err){
    if(!err.statusCode) 
    err.statusCode = 500; 
    next();
  }
}