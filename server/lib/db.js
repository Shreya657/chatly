import mongoose from "mongoose";    
import { DB_NAME } from "../constants.js";

export const connectDB=async()=>{
    try{
       const connection= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log("\n MongoDB connected!!");
    }catch(error){
        console.log("Database connection failed",error);
        process.exit(1);
    }
}