import express from 'express'
import { loginUser,registeruser,adminLogin } from '../controllers/userController.js'

const userRouter= express.Router();
userRouter.post('/register',registeruser);
userRouter.post('/login',loginUser);
userRouter.post('/admin',adminLogin);

export default userRouter;