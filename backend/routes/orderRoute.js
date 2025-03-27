import express from 'express'
import { verifyStripe ,placeOrder, placeOrderRazorPay, placeOrderStripe, allOrders, userOrders, updateStatus, verifyRazorpay} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
const orderRouter = express.Router()

//Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

//payment features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorPay)

//verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)
orderRouter.post('/verifyRazorpay',authUser,verifyRazorpay)

//user features
orderRouter.post('/userOrders',authUser,userOrders)

export default orderRouter