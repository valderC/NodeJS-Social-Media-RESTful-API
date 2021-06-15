const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcrypt');

const User = require('../models/User'); 
const { route } = require('./auth');

//user CRUD operations 

//update user 
router.put('/:id', async (req, res) => {    
    if(req.params.id === req.body.userId || req.body.isAdmin){
        //if client has access and is updating password
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10); 
                const newPassword = await bcrypt.hash(req.body.password, salt);
                //updates the password with newly hashed password  
                req.body.password = newPassword;
                //res.json('password updated!')
            }
            catch(err){
                return res.status(500).json({message: err.message}); 
            }
        }
        //update user
        try{
            const user = await User.findByIdAndUpdate(req.params.id, {
                //will automatically set all inputs inside the body 
                $set: req.body, 
            }); 
            res.status(200).json("Account has been updated!"); 
            //res.json(user); 
        }catch(err){
            return res.status(500).json({message: err.message}); 
        }
    }
    else {
        return res.status(403).json('you can only update your account!')
    }
}); 

//delete user 
router.delete('/:id', async (req, res) => {
    if (req.params.id === req.body.userId || req.body.isAdmin){
        try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send('Deleted successfully');
            }
        catch(err){
            return res.send(400).json({message: err.message}); 
        }
    }
        else {
            return res.status(403).json('you can only delete from your account!'); 
        }
}); 

//get a single user
router.get('/:id', async (req, res) => {
    try{
    const user = await User.findById(req.params.id); 
    //we only need the necessary properites so password etc will not be included in
    const {password, updatedAt, ...other} = user._doc
    res.status(200).json(other); 
    } catch(err){
        res.status(500).json({message: err.message}); 
    }
}); 

//follow a user will be a put request since we'll be updating a list inside the user
router.put('/:id/follow', async (req, res) => {
    //checking to make sure user is not attempting to follow him/her self 
    if(req.params.id !== req.body.userId){
        try{
        //get userId from params 
        let currentUser = await User.findById(req.params.id); 
        let userToBeFollowed = await User.findById(req.body.userId); 
        //checks to see if current is not already following the user to be followed
        if(!currentUser.following.includes(req.params.id)){
            await currentUser.updateOne({$push: {following: req.params.id} });
            await userToBeFollowed.updateOne({$push: {followers: req.body.userId}}) 
            res.status(200).json("now following")
            }
        else {
            return res.status(403).json("Already following!")
        }

         }catch(err){
             return res.status(500).json({message: err.message}); 
         }
    }
    else {
        return res.status(403).json("Can't follow yourself !")
    }
}); 

//unfollow a user 
router.put('/:id/unfollow', async (req, res) => {
    //check to see if user not attempting to unfollow themselves
    if (req.params.id !== req.body.userId){
        try{
        const currentUser = req.params.id; 
        const userToBeUnfollowed = req.body.userId; 
        if(currentUser.following.includes(req.params.id)){
            await currentUser.updateOne({$pull: {following: req.body.userId}});
            await userToBeUnfollowed.updateOne({pull: {followers: req.params.id}}); 
        }
        else{
           return res.status(404).json("User is not being followed!"); 
        }
    }
        catch(err){
            return res.send(500).json({message: err.message}); 
        }
    }
    else {
       return  res.status(404).json("Can not unfollow yourself!"); 
    }
}); 






module.exports = router; 