import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from 'path'
import { fileURLToPath } from "url";
import {register} from "./controllers/auth.js"
import {createPost} from "./controllers/posts.js"
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { verifyToken } from "./middlewares/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users,posts} from './data/index.js'

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();// 1. This loads/moves environment variables (like PORT) from the .env file into process.env.So that we can aceess the environment variable using process.env
const app = express();
app.use(express.json()); 

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}))// This code is configuring the Express application to use the bodyParser.json() middleware to parse incoming JSON data in request bodies. The options object { limit: "30mb", extended: true } provides additional settings for handling the size and structure of the JSON payload. This is particularly useful when dealing with larger JSON data and complex structures in the incoming requests.
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,'public/assets')))

// File Storage
// Multer middleware : to handle uploaded files
// This is a general syntax to define multer middleware
// when a user uploads a file, multer will save the file to the "public/assets" directory on the server.
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"public/assets")//cb - call back function
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
});
const upload = multer({storage})


// Routes with Files
// The below code means whenever a user uploads an image on filling the register form and submitting it.then the details will be posted to the server's "http://localhost:3001/auth/register" path and image will be saved inside the public/assets folder in the server 
app.post("/auth/register",upload.single("picture"),register)//upload is an instance of multer middleware and upload.single("picture") specifically handles the upload of a single file named "picture" from the client.
app.post("/posts",verifyToken,upload.single("picture"),createPost)
//Routes
 // app.use("/auth", authRoutes);: This line integrates the router into the main Express application (app). It specifies that all routes defined in authRoutes should be prefixed with "/auth". For example, the "/login" route becomes "/auth/login". This helps in organizing routes and avoiding conflicts with other parts of the application
app.use("/auth",authRoutes) // authRoutes means auth.js file in routes
app.use("/users",userRoutes)
app.use("/posts",postRoutes)

// Mongoose Setup
const PORT = process.env.PORT || 6001;//1. If you have a specific port configured/customised in your .env file, the server will use that port; otherwise, it will default to 6001.
mongoose.connect(process.env.MONGO_URL)// This code is connecting server to a database using Mongoose, which is an Object Data Modeling (ODM) library for MongoDB and Node.js.
.then(()=>{// mongoose.connect() returns promise
    app.listen(PORT,()=>console.log(`Server Port: ${PORT} and MongoDB Atlas successfully connected with server`))

    // Add Data one time into the Models User and Post MongoDB Atlas collections : posts and users.Note that adding data more than one time causes duplication of a specific data in the collection.so it is important to run the below code only once (See this "Server Port: 3001 and MongoDB Atlas successfully connected with server" only once in the terminal) and after that comment it.  
    //  Fake data for the functioning of the app
//  User.insertMany(users);
//  Post.insertMany(posts);

}).catch((error)=>console.log(`${error} did not connect`))

// http get request resolving to http://localhost:3001
// Server Start: When you start your MERN (MongoDB, Express.js, React, Node.js) server, it initializes and listens for incoming requests. The code you provided is defining a route for the root endpoint ("/"), and when a GET request is made to this endpoint, the server responds with the specified HTML message.This results to give an html element of Project Fair Server Started and waiting for client requests!!!! in the browser UI. This is often used as a simple way to check if the server is up and running during development or deployment.
app.get('/',(req,res)=>{
    res.send(`<h1>Project Fair Server Started and waiting for client requests!!!!</h1>`)
})