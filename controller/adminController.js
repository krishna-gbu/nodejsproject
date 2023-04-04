const Admin = require('../models/adminModel')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const validator = require('validator')
const AppError = require('../utils/appError')



exports.me =  catchAsync(async (req,res,next)=>{
    const userDetails  = await Admin.findById(req.user.id)
    userDetails.password = undefined
    return res.status(200).json({
        userDetails
    })
})


exports.getAllUsers = catchAsync(async(req,res,next)=>{
   const allUsers = await User.find({})
   return res.status(200).json({
    message:"success",
    allUsers
   })
})

exports.deleteUser = catchAsync(async(req,res,next)=>{
    
    // console.log(req.body);

    if(validator.isEmpty(req.body.id)){
        return next(new AppError('Please send User unique id',404))
    }
    const deleteUser =  await User.findByIdAndDelete(req.body.id)
    if (!deleteUser) {
        return next(new AppError('invalid id',409))
    }
    return res.status(200).json({
        message:'successfully deleted User',
    })
}) 
