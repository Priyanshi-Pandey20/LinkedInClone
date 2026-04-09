import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose  from "mongoose";
import postRoute from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
 
const app = express();
app.use(cors());

app.use(express.json());
app.use(userRoutes);
app.use(postRoute);

app.use(express.static("uploads"))



const start = async() => {
    const connectDB = await mongoose.connect("mongodb+srv://pandeypriyanshi2005_db_user:zigLXVaNF5aA8uvX@apnaproconnect.z0yoycn.mongodb.net/")

    app.listen(9090,() => {
        console.log("Server is running on port 9090");
    })
}

start();