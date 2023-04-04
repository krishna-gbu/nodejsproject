const Admin = require('../models/adminModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const validator = require('validator')


exports.sigup = catchAsync(async(req,res,next)=>{
    const {email,password,firstName,lastName} = req.body
   
    if (!validator.isEmail(email) || !validator.isStrongPassword(password)
    || validator.isEmpty(firstName) || validator.isEmpty(lastName)) {
        return next(new AppError(`Please input properly like email,password, firstName and lastName`,400))
    } 
    const findAllAdmin = await Admin.find({})
    if (findAllAdmin.length>=1) {
      return next(new AppError(`We have already one admin`,409))  
    }
    const adminData = await Admin.create(req.body)
    adminData.password = undefined
    return res.status(200).json({
        message: "successfull created",
        adminData
    })
})

const createToken = async(id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXP * 24 * 60 * 60 * 1000 })
}

exports.login = catchAsync(async(req,res,next)=>{
    const {email,password} = req.body
    // console.log(email,password); 
    if(!validator.isEmail(email) || validator.isEmpty(email) 
    || validator.isEmpty(password)) next(new AppError('Please fill Your Details properliy',400))
    
    const getUser = await Admin.findOne({email})
    
    if(!getUser || !(await getUser.checkPassword(password,getUser.password))){
        return next(new AppError('Email or Password is not Correct, Please check and try again'))
    }
    
    const token = await createToken(getUser._id)
    // console.log(token);
     getUser.password = undefined
    return res.status(200).json({
        token,
        getUser
    })
})
 



exports.protect = catchAsync(async(req,res,next)=>{
    // console.log('protected route');

    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if (!token) {
        return next(new AppError('You are lot logged ! please log in to access', 401))
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET)
    // console.log(decode);

    const currentUser = await Admin.findById(decode.id)
    if(!currentUser){
       return next(new AppError('user is not in database'))
    }
    
    // console.log(currentUser);
     
    req.user = currentUser
    next()
})