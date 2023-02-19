const router = require("express").Router();
const User= require("../models/User");
const bcrypt = require('bcrypt');

//Register
router.post("/register", async(req,res) => {
    console.log("register kc");
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(req.body.password,salt);
        const newUser =new User({
            username:req.body.username,
            email: req.body.email,
            password: hashedpass,
        })
        const user = await newUser.save();
        //res.status(200).json(user)
        res.json({status: "ok"})
    }catch(err){
        res.status(500).json(err)
    }
})
//Login
router.post("/login", async(req,res) => {
    console.log("login kc");
    try{
        const user = await User.findOne({username: req.body.name})
        // if no user  
        !user && res.json({status: "wrong credentials"})
        // if same user then compare password
        const validated = await bcrypt.compare(req.body.password,user.password)
        // if not validate
        !validated && res.json({status: "wrong credentials"})

        // To remove password from the db we have to use
        const { password, ...others }=user._doc
        res.json({status: "ok"})
    }catch(err){
        res.status(500);
    }
})
module.exports=router