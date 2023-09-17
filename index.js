const express = require('express');
const path = require("path");
const dotenv = require('dotenv')
const app = express();
const cors = require('cors');
app.use(express.json());
dotenv.config();
app.use(cors());
app.use('/image',express.static(path.join(__dirname, 'image')));
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const facultyRoutes = require("./routes/faculty");
const studentRoutes = require("./routes/student");
const mongoose = require("mongoose");

app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/faculty',facultyRoutes);
app.use('/student',studentRoutes);
// error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message||"error not define";
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECT_TO_DB)
.then(result => {
    app.listen(process.env.PORT);
    console.log("connected");
})
.catch(err => console.log("error",err));
