const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router(); 
const  authenticate = require("../middleware/authenticate");
const app = express();

require('../db/conn');

  
  
const User=require("../model/userSchema");

// Parse incoming requests with JSON payloads
app.use(express.json())
 
 
  
const { AuthMechanism } = require('mongodb');

router.get("/",(req,res)=>{
    res.send(`hello`);
     
    });

router.post('/register', async(req, res) => {
    console.log(`hello`);
    
    const {   name, email, phone, work, password, cpassword } = req.body;
    console.log(name,email,phone);
    
      console.log(`auth.js inside post register api ${req} ${res}`);
    if (!  name || !email || !phone || !work || !password || !cpassword) {
        console.log(`if return inside posr register api ${req} ${res}`)
        return res.status(422).json({ error: "pls fill the field properly" });
    }

    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "email already exists" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "passwords do not match" });
        } else {
            const user = new User({   name, email, phone, work, password, cpassword });
            console.log(`register api data before user.save ${user}`);
            await user.save();
            
            res.status(201).json({ message: "registered successfully" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed registration" });
    }
});

//login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        console.log(user);

        if (!user) {
            return res.status(422).json({ error: "Incorrect email or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(422).json({ error: "Incorrect email or password" });
        }
    
        // Generate JWT token
        console.log("app");console.log(`hello`);
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY );
        console.log(token);
        console.log( "ay");

     
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to login" });
    }

});

// about us page
router.get("/About",authenticate,(req,res)=>{
    console.log(`name`);
    res.send(req.rootuser);

    });
// get user data for contact page
    router.get('/getData',authenticate ,(req,res)=>{
        console.log(`name`);
        res.send(req.rootuser);
    })

    // contact us page
    router.post('/contact', authenticate, async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;
            if (!name || !email || !phone || !message) {
                return res.status(400).json({ error: "Please fill the contact form completely" });
            }
    
            const userContact = await User.findById(req.userID);
            if (!userContact) {
                return res.status(404).json({ error: "User not found" });
            }
    
            userContact.messages.push({ name, email, phone, message });
            await userContact.save();
            res.status(201).json({ message: "Message sent successfully" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Failed to send message" });
        }
    });


    // logout ka page
    router.get("/logout",authenticate,(req,res)=>{
        console.log(`hello on my logout page`);
        res.clearCookie('jwtoken',{path:'/'});
        res.status(200).send( "user logout");
        
        });

module.exports= router;