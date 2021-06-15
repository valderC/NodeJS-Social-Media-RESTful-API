const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcrypt'); 

//importing model 
const User = require('../models/User'); 

//Register 
router.post('/register', async (req, res) => {
    try {
        //generate new password 
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(req.body.password, salt); 

    //create new user 
    const newUser = new User({
        username: req.body.username, 
        email: req.body.email,
        password: hashedPassword, 
    }); 

    //adds newUser request to database 
    const savedUser = await newUser.save()
    //sends json response back to client 
    res.status(200).json(savedUser);
    } catch (err) {
        //sends error if error occured when saving into database 
        res.sendStatus(500).send({message: err.message}); 
      }
}); 

//login user 
router.post('/login', async (req, res) => {
    try{
    const user = await User.findOne({
        email: req.body.email
    }); 
    //is user not found send status code 404 and json message to client 
    !user && res.status(404).json("user not found!"); 

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    //if password is not valid then we'll send message to client 
    !validPassword && res.status(400).json("incorrect password!"); 

   //res.status(200).json(user); 
   res.send('successfull login!')
}catch(err){
    res.status(500).json({message:err}); 
}
}); 

module.exports = router; 