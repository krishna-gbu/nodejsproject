const mongoose = require('mongoose')
const valid = require('validator')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
   email:{
    type:String,
    unique: true,
    index: true,
    require: [true,'Please Provide Your Email Address'],
    lowercase: true,
    validate:[valid.isEmail,"Please Provide valid Email Address"]
   },
   password:{
    type:String,
    require:[true,"Please Provide Your Password"],
    validate:[valid.isStrongPassword,'minlength:8,minUppercase:1,minNumber:1,minSymbol:1,minLowerCase:1']
   },
   firstName:{
    type:String,
    require:[true,'Please Provide First Name'],
   },
   lastName:{
      type:String,
      require:[true,"Please Provide Last Name"]
   },
   isVerified:{
      type:String,
      default:false
   }

})




adminSchema.pre('save',async function(next){
   if(!this.isModified('password')) return next()
   this.password = await bcrypt.hash(this.password ,15) 
   next()
})


adminSchema.methods.checkPassword = async function(plainPassword,hashpassword){
  return  await bcrypt.compare(plainPassword,hashpassword)
}

const Admin  = mongoose.model('Admin',adminSchema)
module.exports = Admin