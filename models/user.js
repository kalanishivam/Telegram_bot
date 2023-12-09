import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name:{
        type: String, 
        required : true
    },
    userId :{
        type:String, 
        required : true
    }, 
    city : {
        type : String,
        required : true
    }
})

const userDetails   = model("user", userSchema);
export default userDetails;