const router = require("express").Router();
const jwt = require("jsonwebtoken");
// Importing User model from ../models/User.js
const User = require("../models/User");
//Importing  registerValidation
const { registerValidation, loginValidation } = require("../validation");
// Import bcrypt
const bcrypt = require("bcryptjs");

//* -------------------POST Route---------------------*//
// Route: /api/user/register
// @public route
// @use to register the user to databas

router.post("/register", async (req, res) => {
  //Validate data before saving to database
  const { error } = registerValidation(req.body);
  //Checking if the user already  exists in database

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  if (error) return res.status(400).send(error.details[0].message);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.status(200).send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

//Login Route

router.post("/login", async (req, res) => {
  //Validate data before saving to database
  const { error } = loginValidation(req.body);
  //Checking if the user already  exists in database
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found");
  //checking password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
  // res.status(200).send("Login successful");
});

module.exports = router;
