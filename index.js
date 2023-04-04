const express = require('express')
const mongoose = require('mongoose')
const cors  = require('cors')
const userRoute = require('./routes/userRoute')
const adminRoute = require('./routes/adminRoute')
const AppError = require('./utils/appError')
const globalErrorController  =require('./controller/errorController')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
// console.log(process.env.LOCAL_DATABASE);

mongoose.set('strictQuery', false)
mongoose.connect(
    // process.env.LOCAL_DATABASE,
    process.env.CLOUD_DATABASE,
    {
        useNewUrlParser: true,
        // useCreateIndex:true,
        // useFindAndModify:false,
    }
).then(() => {
    console.log('database connected')
})



app.use('/api/v1/users',userRoute)
app.use('/api/v1/admin',adminRoute)

app.use('/',(req,res,next)=>{
//   console.log(req.cookies);
  return  res.status(200).json({message:'api working good'})
})

app.all('*',(req,res,next)=>{
    next(new AppError(`can't find ${req.originalUrl} on thier server`))
})


app.use(globalErrorController)

const Port = process.env.PORT || 5000
app.listen(Port, () => {
    console.log(`server is running on ${Port}`);
})