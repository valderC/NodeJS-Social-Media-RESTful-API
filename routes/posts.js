const express = require('express');
const router = express.Router(); 

//import model 
const Post = require('../models/Post'); 
const User = require('../models/User'); 
//const { route } = require('./auth');

//get all post 
// router.get('/', async (req, res) => {
//     try{
//         //obtains all of the post data from the model
//         const post = await Post.find(); 
//         res.status(200).json(post); 
//     }catch(err){
//         res.json(404).json({message: err.message});
//     }
// }); 

//get a single post 
router.get('/:id', async (req, res) => {
    try {
        const userPost = await Post.findById(req.params.id); 
        res.status(200).json(userPost); 
    } catch(err) {
        res.status(500).json({message: err.message});
    }
}); 

//get timeline post (post of the people the user follows)
router.get('/timeline/all', async (req, res) => {
    try{
        //instead of using await i'll use multiple promises to fetch the data 
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find( { userId: currentUser._id }); 

        const friendPosts = await Promise.all(
            currentUser.following.map((friendId) => {
              return Post.find({ userId: friendId });
            })
        ); 
        res.status(200).json(userPosts.concat(...friendPosts)); 

    }catch(err){
        res.status(500).json({message: err.message}); 
    }
}); 


//create a post 
router.post('/', async (req, res) => {
    const newPost = new Post(req.body); 
    try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost); 
    }catch(err){
        res.status(500).json({message: err.message}); 
    }
}); 

//delete a post 
router.delete('/:id', async (req, res) => {
    try {
    if (req.params.id === req.body.userId){
        await Post.findByIdAndRemove(req.params.id); 
        res.status(200).json("Post deleted!")
    }
    else{
        res.status(403).json('can only delete your post!')
    }
    }catch(err){
        res.status(500).json({message: err.message}); 
    }
}); 

//update a post 
router.put('/:id', async (req, res) => {
    try {
    //verify user before updating the post
    if(req.body.userId === req.params.id){
        const postToUpdate = await Post.findById(req.params.id); 
        await postToUpdate.updateOne({ $set: req.body }); 
        res.status(200).json("Post updated!");
    } else {
        res.status(403).json("can only update your own post!")
        }

     }catch(err){
        res.status(500).json({message: err.message}); 
    }   
}); 

//like or dislike a post 
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); 
        if (!post.likes.includes(req.body.userId)){
            await post.updateOne({ $push: { likes: req.body.userId } }); 
            res.status(200).json("Post has been liked!"); 
        }
        else {
            await post.updateOne({ $pull: { likes: req.body.userId } }); 
            res.status(200).json("Post has been unliked")
        }
    }catch(err){
        res.status(500).json({message: err.message}); 
    }
}); 

module.exports = router;