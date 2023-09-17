const express = require("express");
const router = express.Router();

const Student = require("../models/student");
const studentController = require("../controllers/student");
const isAuth = require("../middleware/isAuth");

router.get("/viewattendance/:student",isAuth,studentController.viewAttendance);
router.get("/viewresult/:student",isAuth,studentController.viewResult);
router.get("/viewresultpersubject/:student",isAuth,studentController.viewResultExamwise);
router.get("/viewAnnouncement",studentController.viewAnnouncement); 
module.exports=router;

