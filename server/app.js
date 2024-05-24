
const dotenv = require('dotenv');

const mongoose =require('mongoose');
const express = require("express");
const app=express();
app.use(express.json());
 
dotenv.config({path:'./config.env'});

require('./db/conn');
require('./middleware/authenticate');

// app.use(express.json());

//const User = require('./model/userSchema');
app.use(require('./router/auth'));
 

const DB =  process.env.DATABASE;

 
const PORT=process.env.PORT;


 //middleware

// const  middleware=(req,res,next) =>{
// console.log(`my name is nikita kumawat`);
// next(); 
// }
 
// app.get("/",(req,res)=>{
// res.send(` my `);
// });

// app.get("/About",(req,res)=>{
//     console.log(`name`);
//     res.send(` is`);
    
//     });

app.get("/Contact",(req,res)=>{
    res.send(`nikita`);
    });

    app.get("/signin",(req,res)=>{
        res.send(`kumawat `);
        });

        app.get("/signup",(req,res)=>{
            res.send(`my best forerver is `);
            });

console.log(`qwerfg`);

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
})