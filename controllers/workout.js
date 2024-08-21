const Workout = require("../models/Workout");
const { errorHandler } = require('../auth');

module.exports.createWorkout = (req, res) => {
    let newWorkout = new Workout({
        name: req.body.name,
        duration: req.body.duration,
        status: 'pending',
        userId: req.user.id // Include the userId in the new workout data
    });

    Workout.findOne({ name: req.body.name })
        .then(existingWorkout => {
            if (existingWorkout) {
                return res.status(409).send({ message: 'Workout already exists' });
            } else {
                return newWorkout.save()
                    .then(result => {
                        const formattedResult = {
                            "_id": result._id,
                            "userId": result.userId,
                            "name": result.name,
                            "duration": result.duration,
                            "status": result.status,
                            "dateAdded": result.dateAdded,
                            "__v": result.__v
                        };
                        res.status(201).send({ workout: formattedResult });
                    })
                    .catch(err => errorHandler(err, req, res));
            }
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.completeWorkoutStatus = (req, res) => {
    let completedWorkout = {
        status: "complete",
        userId: req.user.id // Include the userId in the completed workout data
    }

    return Workout.findByIdAndUpdate(req.params.id, completedWorkout, { new: true })
    .then(workout => {
        if (workout) {
            const updatedWorkout = {
                _id: workout._id,
                userId: workout.userId,
                name: workout.name,
                duration: workout.duration,
                status: workout.status,
                dateAdded: workout.dateAdded,
                __v: workout.__v
            };

            res.status(200).send({
                message: 'Workout status updated successfully',
                updatedWorkout: updatedWorkout
            });
        } else {
            res.status(404).send({ message: 'Workout not found' });
        }
    })
    .catch(err => errorHandler(err, req, res));
}

module.exports.deleteWorkout = (req, res) => {
    const { id } = req.params;

    Workout.findByIdAndDelete(id)
        .then(deletedWorkout => {
            if (!deletedWorkout) {
                return res.status(404).send({ message: 'Workout not found' });
            }
            return res.status(200).send({ message: 'Workout deleted successfully' });
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.getAllWorkouts = (req, res) => {
    return Workout.find({})
        .then(result => {
            if (result.length > 0) {
                return res.status(200).send({ workouts: result });
            } else {
                return res.status(404).send({ message: 'No Workout found' });
            }
        })
        .catch(err => errorHandler(err, req, res));
};

module.exports.updateWorkout = (req, res) => {
    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration,
        userId: req.user.id // Include the userId in the updated workout data
    }

    return Workout.findByIdAndUpdate(req.params.id, updatedWorkout, { new: true })
        .then(workout => {
            if (workout) {
                const updatedWorkoutResponse = {
                    _id: workout._id,
                    userId: workout.userId,
                    name: workout.name,
                    duration: workout.duration,
                    status: workout.status,
                    dateAdded: workout.dateAdded,
                    __v: workout.__v
                };

                res.status(200).send({
                    message: 'Workout updated successfully',
                    updatedWorkout: updatedWorkoutResponse
                });
            } else {
                res.status(404).send({ message: 'Workout not found' });
            }
        })
        .catch(error => errorHandler(error, req, res));
};