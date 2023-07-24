// controllers/users.js

const bcrypt = require('bcryptjs'); // importing bcrypt
const User = require('../models/user');

exports.createUser = (req, res) => {
    // hashing the password
    bcrypt.hash(req.body.password, 10)
        .then(hash => User.create({
            email: req.body.email,
            password: hash, // adding the hash to the database
        }))
        .then((user) => res.send(user))
        .catch((err) => res.status(400).send(err));
};

module.exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('Incorrect password or email'));
            }
            // comparing the submitted password and hash from the database
            return bcrypt.compare(password, user.password);
        })
        .catch((err) => {
            res
                .status(401)
                .send({ message: err.message });
        });
}; 