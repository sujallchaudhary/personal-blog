const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();
const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:'Invalid credentials'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:'Invalid credentials'});
        }
        const token = jsonwebtoken.sign({userId:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:'30d'});
        return res.status(200).json({success:true,message:'Login successful',token,data:{name:user.name,email:user.email,role:user.role}});
    }
    catch(error){
        return res.status(500).json({success:false,message:'Internal server error'+error});
    }
};

module.exports = {login};