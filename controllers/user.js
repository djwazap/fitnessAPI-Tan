const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require('../auth')
const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {

    if (!req.body.email){
        return res.status(400).send({ error: 'Email is required' });
    } else if (!req.body.name){
        return res.status(400).send({ error: 'Name is required' });
    } else if (!req.body.password){
        return res.status(400).send({ error: 'Password is required' });
    } else {
        let newUser = new User({
            email: req.body.email,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
            .then((result) => res.status(201).send({ message: "Register Successfully" }))
            .catch(err => errorHandler(err, req, res));
    }
}

module.exports.loginUser = (req, res) => {

    if (req.body.email.includes("@")){
        return User.findOne({ email: req.body.email })
            .then(result => {
                if (result === null) {
                    return res.status(404).send({ error: 'Invalid Email' });
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                    if (isPasswordCorrect) {
                        return res.status(201).send({ 
                            access: auth.createAccessToken(result)
                        });
                    } else {
                        return res.status(401).send({ error: 'Email and password do not match' });
                    }
                }
            })
            .catch(err => errorHandler(err, req, res));
    } else {
        return res.status(400).send({ error: 'No Email Found' });
    }
}