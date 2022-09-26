const express = require('express');
const User = require('../models/user');
const auth = require('../auth/authenticate');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');

//Signup route
router.post('/signup', async(req, res) => {
    try {
        const isUserExists = await User.findOne({ email: req.body.email });
        if(isUserExists){
            return res.status(200).send({user: isUserExists, message: `User with email: ${req.body.email} is already registered!`})
        }
        const user = new User(req.body);
        await user.save();
        return res.status(201).send({ user });
    } catch (e) {
        return res.status(400).send(e);
    }
});

//Login route
router.post('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        if(!user.status){
            return res.status(400).send({ Message: user.message });
        }
        const token = jwt.sign({ email : user.email }, 'thisisfreelancejwt', { expiresIn: 60 * 60 });
        return res.status(200).send({ user: user, token: token });
    } catch (e) {
        return res.status(400).send(e);
    }
});

//Logout route
router.post('/logout', auth, async(req, res) => {
    try {
        return res.status(200).send({'Message': 'Successfully log out'});
    } catch (e) {
        return res.status(500).send();
    }
});

//Get user details route
router.get('/user', auth, async(req, res) => {
    try{
        let userData = await User.findOne({email: req.body.email})
        return res.status(200).send({ User: userData });
    }catch(err){
        return res.status(500).send({"Message": "Error getting user details"});
    }
});

//update user details route
router.patch('/user', auth, async(req, res) => {
    let {firstName, lastName, password} = req.body
    try {
        if(password){
            password = await bcrypt.hash(password, 8);
        }
        let userUpdate = await User.findOneAndUpdate({ email: req.body.email }, { firstName, lastName, password })

        return res.status(200).send({ user: userUpdate });
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.delete('/user', auth, async(req, res) => {
    try {
        let userDeleted = await User.deleteOne({email: req.body.email})
        return res.status(200).send(userDeleted);
    } catch (e) {
        return res.status(500).send(e);
    }
});

module.exports = router;