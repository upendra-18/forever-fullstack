import express from 'express'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cors from "cors";
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
//app config
const app= express()
const port= process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
app.use(express.json()); // Parses JSON data
app.use(express.urlencoded({ extended: true })); // Parses form data
// Allow specific origins
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));
//api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)


app.get('/',(req,res)=>{
    res.send('api Working')
})
app.listen(port,()=>console.log('server ha started on '+port))