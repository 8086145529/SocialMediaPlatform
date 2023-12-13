import bcrypt from 'bcrypt' //bcrypt is a library used for securely hashing passwords.
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
 // auth means authentication (i.e process happens when a user register).Since controller is used to communicate between server and MongoBD
 //register function (asynchronus function) is defined to perform/handle the actual registration process, including storing user data in a database.This register function is called on app.post("/auth/register",upload.single("picture"),register)

//  REGISTER USER
export const register = async(req,res)=>{
    try {
        // Here we are destructuring the all data from the frontend request body and then we are assigning this variables's values to the User model by creating a new instance of this User model.so that the user entries should store in the mongoDB.since the variables in the request and the properties in the model has same name,we can simply use firstName instead of firstName:firstName
        
        const {firstName,lastName,email,password,picturePath,friends,location,occupation} = req.body// destructuring the all data from the frontend request body
        const salt = await bcrypt.genSalt()//A salt is a random value that is used as an additional input to the password hashing process to the original password before adding hash.Giving salts is a part of Hashing bcrypt.genSalt() generates a random salt that will be used during the password hashing process used as an argument
        const passwordHash = await bcrypt.hash(password,salt) //Hashing is a one-way process of converting the user's original password into a fixed-length string of characters

        const newUser = new User({// fetching the data entered by the user from the request and store them in respective keys in the model User by creating a new instance of the User model named newUser.firstName value to firstName key,inshort firstName
            firstName,lastName,email,password:passwordHash,picturePath,friends,location,occupation,viewedProfile:Math.floor(Math.random() * 10000),impressions : Math.floor(Math.random() * 10000)  
        })
        const savedUser = await newUser.save();//This .save() is used to save the above changes in the MongoDB collection like in the mongoose's model
        res.status(201).json(savedUser) // means if the registeration become successful,the send a response with 201 status and the savedUser data that converted to json format using .json()
    } catch (error) {
        res.status(500).json({error:err.message})
    }
}

// LOGGING IN (Authentication process)
 //
export const login = async(req,res)=>{
    try{
        const {email,password} = req.body
    const user = await User.findOne({email:email})//User.findOne({email:email}) means this returns only a document/object (with that user details in the database) which contains the email key with value as the provided email in requestbody
    if(!user) return res.status(400).json({msg: "User doesn't exist"})// If no user is found with the provided email, it responds with a 400 status and a message indicating that the user doesn't exist.

    const isMatch = await bcrypt.compare(password,user.password) //This means we are comparing the password in that same document that contain the email of the specific User with the password in the reqbody
    if(!isMatch) return res.status(400).json({msg:"Invalid Credential"})// The message "invalid credentials" usually means that the system found a user account with the provided username or email, but the entered password does not match the stored password for that account.

    // This code is responsible for generating a JWT after successful user authentication and sending it, along with user information (with sensitive data removed), to the frontend as part of the authentication response. This JWT is then used by the frontend for subsequent authenticated requests to the backend.
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET)//_id is a key generatd automatically when a user object created in the database.//If the email and password are valid, it creates a JWT (JSON Web Token) using the user's ID and a secret key stored in the environment variables.
    delete user.password;// This line ensures that the user's password is not included in the response sent to the frontend.
    res.status(200).json({token,user})//Finally, a response is send to the frontend with a 200 status (OK), the generated JWT, and the user information.we can see this two in the preview section.important step
}catch(err){
    res.status(500).json({error:err.message}) //500 staus code means Internal Server Error:
}


}
