import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {
  const {navigate, token, setCartItems, backendUrl} = useContext(ShopContext)
  const [searchParams,setSearchParams] = useSearchParams()
  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')
  
  const verifypayment = async()=>{
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(backendUrl+'/api/order/verifyStripe',{success,orderId},{headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }})
      if(response.data.success){
        setCartItems({})
        navigate('/orders')
      }else{
        navigate('/cart') 
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    verifypayment()
  },[token])

  return (
    <div>
        
    </div>
  )
}

export default Verify