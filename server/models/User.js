import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName:{
            type:String,
            require:true,
            min:2,
            max:50,
        },
        lastName:{
            type:String,
            require:true,
            min:2,
            max:50,
        },
        email:{
            type:String,
            require:true,
            max:50,
            unique:true
        },
        password:{
            type:String,
            require:true,
            min:5
        },
        picturePath:{
            type:String,
            default:""
        },
        friends:{
            type:Array,
            default:[]
        },
        location:String,
        occupation:String,
        viewedProfile:Number,
        impressions:Number
    },{timestamps:true}// This timestamps:true give as automatic dates like when it's created when it's updated
);

// creating model with name User based on the schema named UserSchema.A model that shows how this datas get stored in the mongoDB.The "User" inside the () represents the collection in the database correspond to the model User
const User = mongoose.model("User",UserSchema)//  After inserting respective datas to the models of Mongoose (code defined in index.js), the Mongoose automatically creates collections in the MongoDB Atlas,where the corresponding collections name will be small letters and pluralises it.i.e "User" model ==> "users" collection
export default User