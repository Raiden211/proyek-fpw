import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors, { CorsOptions } from 'cors';
import route from "../src/routes/index";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Define CORS options
const corsOptions: CorsOptions = {
    origin: '*', // Replace with your frontend domain, e.g., 'http://localhost:3000'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use('/v1', route)


app.listen(port, async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/toserbafpw')
        console.log('Database connected')
    }
    catch(e){
        console.log('Error database connection \n', e)
    }
    console.log(`listening on port ${port}!`)
})