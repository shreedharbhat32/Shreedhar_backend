//require('dotenv').config();
import dotenv from "dotenv";
//import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./.env"
});


import {app} from "./app.js";
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    })
})
.catch((err)=>{
    console.log("MONGODB CONNECTION ERROR", err);
})












// import express from "express";
// const app = express();

// (async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error)=>{
    //             console.error("Error in server setup", error);
    //})

//         app.listen(process.env.PORT || 3000,()=>{
//             console.log(`Server is running on port ${process.env.PORT || 3000}`);
//         });
//     }catch(err){
//         console.error("Failed to connect to MongoDB", err);
//     }
// }) 

