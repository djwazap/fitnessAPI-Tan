const express = require('express');
const userController = require("../controllers/user");
const { verify, isLoggedIn } = require("../auth");
const passport = require("passport");

// Routing component
const router = express.Router();

// Routes will be placed here

// Route for user registration
router.post("/register", userController.registerUser);

// Route for user login
router.post("/login", userController.loginUser);




module.exports = router;