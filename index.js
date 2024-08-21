const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
require('dotenv').config();

// Allows access to routes defined within our application
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

// Environment setup
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const corsOptions = {

	origin: ['http://localhost:4000'],
	credentials: true,
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

if(require.main === module) {
	// "process.env.PORT || 3000" will use the environment variable if it is available OR will used port 3000 if none is defined
	// This syntax will allow flexibility when using the application locally or as a hosted application
	app.listen(process.env.PORT || 4000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = { app, mongoose };