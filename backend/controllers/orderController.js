import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import Stripe from 'stripe'
import razorpay from 'razorpay'
//global variables
const currency = 'INR'
const deliveryCharge = 10

// gate way initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
  key_id : process.env.RAZORPAY_KEY_ID,
  key_secret : process.env.RAZORPAY_KEY_SECRET,
})


// placing orders by COD
const placeOrder = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        
        const amountBody = req.body.amount;
        const orderData = {
            userId,
            items,
            amount: Number(amountBody), // Ensure amount is correctly stored
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };
        const newOrder = new orderModel(orderData);

        const savedOrder = await newOrder.save(); // Assign saved order

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order placed"}); // Use correct amount
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// placing orders by stripe
const placeOrderStripe = async (req,res)=>{
  try {
    // CORRECTED: Properly destructure amount from req.body
    const { userId, items, address, amount } = req.body;
    const { origin } = req.headers;

    const orderData = {
        userId,
        items,
        amount: Number(amount), // Ensure amount is correctly stored
        address,
        paymentMethod: "stripe",
        payment: false,
        date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save(); // Assign saved order
    
    const line_items = items.map((item)=>({
      price_data:{
        currency:currency,
        product_data:{
          name:item.name
        },
        unit_amount:item.price*100
      },
      quantity:item.quantity
    }))
    line_items.push({
      price_data:{
        currency:currency,
        product_data:{
          name:'Delivery Charges'
        },
        unit_amount:deliveryCharge*100
      },
      quantity:1
    })

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${savedOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${savedOrder._id}`,
      line_items,
      mode:'payment',
    })
    res.json({success:true,session_url:session.url})
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// verify stripe
const verifyStripe = async (req,res)=>{
  const { orderId, success, userId } = req.body
  try {
    
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId,{Payment:true})
      await userModel.findByIdAndUpdate(userId,{cartData:{}})
      res.json({success:true});
    } else{
      await orderModel.findByIdAndDelete(orderId)
      res.json({success:false})
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// placing orders by RazorPay
const placeOrderRazorPay = async (req,res)=>{
  try {
    const { userId, items, address, amount } = req.body;
    const orderData = {
        userId,
        items,
        amount: Number(amount),
        address,
        paymentMethod: "Razorpay",
        payment: false,
        date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    const savedOrder = await newOrder.save(); 
    const options = {
      amount: amount*100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString()
    }
    await razorpayInstance.orders.create(options, (error,order)=>{
      if (error) {
        console.log(error);
        return res.json({success:false,message:error})
      }
      res.json({success:true,order})
    })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//verify razorpay payment
const verifyRazorpay = async (req,res)=>{
  try {
    const {userId,razorpay_order_id} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if (orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt,{Payment:true})
      await userModel.findByIdAndUpdate(userId,{cartData:{}})
      res.json({success:true,message:"Payment Successful"})
    }else{
      res.json({success:false,message:"Payment failed"})
    }
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// all orders data for the admin pannel
const allOrders = async (req,res)=>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// user order data for the frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }); // Added `await`
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message }); // Set proper HTTP status code
    }
};


//update order status from admin pannel
import mongoose from "mongoose";

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Validate if orderId is a valid MongoDB ObjectID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Returns the updated document
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({ success: true, message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { verifyStripe ,placeOrder, placeOrderRazorPay, placeOrderStripe, allOrders, userOrders, updateStatus, verifyRazorpay}