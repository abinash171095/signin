const { json } = require("express");
const userModel = require("../model/userSchema.js");
const emailValidator = require('email-validator');
const bcrypt=require('bcrypt');


const signup = async(req,res,next) =>{
    const {name,email, password, confirmPassword}=req.body;
    console.log(name,email, password, confirmPassword);

if(!name || !email || !password || !confirmPassword){
    return res.status(400).json({
        success: false,
        message:"every field is required"
    })
}

const validEmail= emailValidator.validate(email);
if(!validEmail){
    return res.status(400).json({
        success: false,
        message:"valid email is required"
    })
}
if(password!==confirmPassword){
    return res.status(400).json({
        success: false,
        message:"password and confirmPassword should be same"
    })
}

try{
    const userInfo = userModel(req.body);

    const result= await userInfo.save();
    return res.status(200).json({
        success:true,
        data:result
    })

}catch(e){
    if(e.code===1100){//for already existing accounts
        return res.status(400).json({
            success: false,
            message:"e.message"
        })
    }
return res.status(400).json({
    success: false,
    message:e.message
})
}


}


const signin= async(req,res)=>{
    const { email, password}=req.body;
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message:"every field is mandatory"
        })
    }


    try{
        const user=await userModel
        .findOne({
            email
        }).select("+password");
        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({
                success: false,
                message:"invalid credentials"
            })
        }
        const token=user.jwtToken();
        user.password=undefined;
    
        const cookieOptin={
            mxAge:24*60*60*1000,
            httpOnly:true
        };
    
        res.cookie("token",token,cookieOptin);
        res.status(200).json({
            success:true,
            data:user
        })
    }catch(e){
        return res.status(400).json({
            success: false,
            message:e.message
        })
    }

}

const getUser= async(req,res,next)=>{
    const userId=req.user.Id;
    try{
        const user=await userModel.findById(userId);
        return res.status(200).json({
            success: true,
            data: user
        });
    }catch(e){
        return res.status(400).json({
            success:false,
            message:e.message
        })
    }
}


const logout = async (req, res, next) => {
    try {
      const cookieOption = {
        expires: new Date(), // current expiry date
        httpOnly: true //  not able to modify  the cookie in client side
      };
  
      // return response with cookie without token
      res.cookie("token", null, cookieOption);
      res.status(200).json({
        success: true,
        message: "Logged Out"
      });
    } catch (error) {
      res.stats(400).json({
        success: false,
        message: error.message
      });
    }
  };
  

module.exports={
    signup,
    signin,
    getUser,
    logout
}