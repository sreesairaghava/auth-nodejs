const express = require("express");
const mongoose = require("mongoose");
//assigning app to express function
const app = express();
require("dotenv").config();
//Connect to Database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("connected to DB");
});
// Using Middlewares
app.use(express.json());

//Import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
//user routes
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);
//listen app on some port
app.listen(5000, () => {
  console.log("Server up and running");
});
