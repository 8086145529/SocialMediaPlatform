import Post from '../models/Post.js';
import User from '../models/User.js';

// CREATE POST
// Here the user creates a post and on this the controller returns a response with all posts including the newly saved one 
export const createPost = async(req,res)=>{
    try {
        const {userId,description,picturePath} = req.body
        const user = await User.findById(userId)// getting the specific user's data from the  User model
        const newPost = new Post({
           userId,
           firstName:user.firstName,
           lastName:user.lastName,
           location:user.location,
           description,
           userPicturePath:user.picturePath,
           picturePath,
           likes:{},
           comments:[]
        })
        await newPost.save()// saving this new post to the database Post model
        const post = await Post.find();// Here we are fetching all posts including the newly saved one from the database Post model and sends this all posts as response
        res.status(201).json(post);// and here we give a response using post variable that contains all posts including the newly saved one. 201 status code represents you createed something
    } catch (err) {
        res.status(409).json({message:err.message})
    }
}

// READ/GET
export const getFeedPosts = async(req,res) => {
    try{
        const post = await Post.find()
        res.status(200).json(post)

    } catch(err){
        res.status(409).json({message:err.message})

    }
}

export const getUserPosts = async(req,res) => {
    try{
        const {userId} = req.params
        const post = await Post.find({userId})//This find({userId:userId}) returns all the posts posted by that user.i.e returns all document.{userId} is must because it means {userId:userId} key is one in the database and value is the one in the request
        res.status(200).json(post)

    } catch(err){
        res.status(409).json({message:err.message})

    }
}
   
// UPDATE
export const likePost = async(req,res) => {
    try {
        const {id} = req.params// id of that post created in the database 
        const {userId} = req.body // id of the user who likes it
        const post = await Post.findById(id) // This findById(id name) returns only one document.i.e only the post containing that id
        const isLiked = post.likes.get(userId)// we are getting if the user likes it or not

        if(isLiked){
            post.likes.delete(userId);
        }else{
            post.likes.set(userId,true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes:post.likes},
            {new: true}
        );
        res.status(200).json(updatedPost)
    } catch (err) {
        res.status(404).json({message:err.message})
    }
}

