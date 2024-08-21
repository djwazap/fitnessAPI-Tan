const express = require("express");
const workoutController = require("../controllers/workout");
const { verify } = require("../auth");

const router = express.Router();

// Route to add workouts
router.post("/addWorkout", verify, workoutController.createWorkout);

// Route to get all workouts
router.get("/getMyWorkouts", verify, workoutController.getAllWorkouts);

// Route to delete workout
router.delete("/deleteWorkout/:id", verify, workoutController.deleteWorkout);

// Route to complete workout status
router.post("/completeWorkoutStatus/:id", verify, workoutController.completeWorkoutStatus);

// Route to update a workout
router.patch("/updateWorkout/:id", verify, workoutController.updateWorkout);

// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;