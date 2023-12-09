import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

export const connectToDB = async ()=>{
    const URL = process.env.DB_URL;
    try{    
        await mongoose.connect(URL);
        console.log("CONNECTED");
    }catch(error){
        console.log(`error in connecting to database in db.js file, ${error.message}`)
    }
}