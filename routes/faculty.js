const express = require("express");
const router = express.Router();

const faculty = require("../models/faculty");
const facultyController = require("../controllers/faculty");
const isAuth = require("../middleware/isAuth");


router.post("/attendance",isAuth,facultyController.addAttendance);
router.post("/results",isAuth,facultyController.addresults);
router.get("/viewscores/:batch/:sub",isAuth,facultyController.viewScores);
router.post("/makeannouncement/:id",isAuth,facultyController.makeAnnouncements);
router.delete("/deleteannouncement/:annid/:facid",isAuth,facultyController.deleteAnnouncements);
router.get("/viewann/:id",facultyController.viewyourann);
module.exports=router;

