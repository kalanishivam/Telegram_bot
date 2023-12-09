import userDetails from "../models/user.js"
import dotenv from 'dotenv'
import fs from "fs";
dotenv.config();


export const getData = async (req, res)=>{
    try {
        const allData = await userDetails.find({});
        // console.log("in the getData function")
        res.render("panel" , {allData : allData});  // Send the data as a response
    } catch (error) {
        // Handle errors, for example, send an error response
        console.error("error in getdata function",error);
        res.status(500).send('Internal Server Error');
    }
}


export const deleteEntry = async (req, res) =>{
    console.log("int the dlete netry funciton")
    const userId = req.params.userId;
    try{
    await userDetails.findOneAndDelete({userId : userId});   // Deletes the user from database
    console.log(`Entry deleted from database with userID : ${userId}`)
    res.redirect("/adminpanel")
    }catch(error){
        console.log("error in deleting user in delete entry function");
    }
}


export const changeApiKey = (req, res)=>{
    const envFilePath = '.env';
    console.log(req.body)
    const newKey = req.body.changeKey
    console.log(newKey)
    try{
        const envData = fs.readFileSync(envFilePath, 'utf8');
        // Note: The code is set to change the env file named TEMP_KEY. TEMP_KEY can be replaced with the actual name of key to change it. 
        const updatedEnvData = envData.replace(new RegExp(`TEMP_KEY=.+`), `TEMP_KEY="${newKey}"`);
        fs.writeFileSync(envFilePath, updatedEnvData);   // Replaces the API KEY with the new entered key
        res.redirect("/adminpanel");
    }catch(error){
        console.log("error in the change api key folder");
    }

}