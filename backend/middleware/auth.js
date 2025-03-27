import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
  // Get Authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Authorization header missing" });
  }

  // Split into parts
  const parts = authHeader.split(' ');
  
  // Validate format
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ success: false, message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const token_decode = jwt.verify(token,process.env.JWT_SECRET)
    req.body.userId= token_decode.id
    next()
  } catch (error) {
    console.log(error);
    res.json({ success: false,message: error.message })
  }
}

export default authUser;