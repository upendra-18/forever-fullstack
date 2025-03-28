import express from 'express'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cors from "cors";
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App config
const app = express()
const port = process.env.PORT || 4000

// Database connections
connectDB()
connectCloudinary()

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174',
  'https://forever-frontend-lemon-psi.vercel.app',
  'https://forever-frontend.vercel.app',
  'https://forever-admin-ruby-six.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  credentials: true
}

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Health check endpoint
app.get('/', (req, res) => {
    res.send('API Working')
})

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`))