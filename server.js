import express from 'express';
import mongoose from 'mongoose';
import config from './config/dbconfig.js';
 const db = config.get(process.env.NODE_ENV);

const server = express();
// Set global options 
// Connect to the database 
mongoose.connect(db.DATABASE).then(console.log('DB connected 🚀'));
// Middleware to parse json 
server.use(express.json());
 // Middleware to parse x-www-form-urlencoded 
server.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;
server.listen(port, ()=>{
    console.log(`Server launched on ${port} 🚀 `);
});
