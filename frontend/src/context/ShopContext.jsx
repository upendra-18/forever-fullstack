import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;
  //const backendUrl=import.meta.env.VITE_BACKEND_URL; use this if products not displaying
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search,setSearch]=useState('');
  const [showSearch,setShowSearch]=useState(false);
  const [cartItems,setCartItems]=useState({});
  const [products,setProducts]= useState([]);
  const [token,setToken] = useState(''); //using for login
  const navigate= useNavigate();


  const addToCart= async (itemId,size)=>{
    if (!size) {
      toast.error('Please Select Size');
      return;
    }
    let cartData=structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] +=1;
      } else {
        cartData[itemId][size] =1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] =1;
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(backendUrl+'/api/cart/add',{itemId,size},{
          headers:{
            'Authorization' : `Bearer ${token}`
          }
        })
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    }
  };

  const getCartCount = () => {
  let totalCount = 0;

  for (const category in cartItems) {
    const items = cartItems[category];

    if (typeof items === 'object') { 
      for (const item in items) {
        if (items[item] > 0) {
          totalCount += items[item];
        }
      }
    }
  }

  return totalCount;
};
const getCartAmount = ()=>{
  let totalAmount=0;
  for(let items in cartItems){
    let prodInfo=products.find((product)=>(product._id===items));
    for(let item in cartItems[items]){
      try {
        if (cartItems[items][item]>0) {
          totalAmount+=prodInfo.price * cartItems[items][item];
        }
      } catch (error) {
        
      }
    }
  }
  return totalAmount;
};

const updateQuantity= async (itemId,size,quantity)=>{
  let cartData= structuredClone(cartItems);
  cartData[itemId][size]=quantity;
  setCartItems(cartData);
  if (token) {
    try {
      await axios.post(backendUrl+'/api/cart/update',{itemId,size,quantity},{
        headers:{
          'Authorization' : `Bearer ${token}`
        }
      })
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
};
const getUsercart = async () => {
  const token_f_get = localStorage.getItem("token"); 
  if (!token_f_get) {
    toast.error('Please log in to view your cart');
    return;
  }

  try {
    const response = await axios.get(backendUrl + '/api/cart/get', {
      headers: {
        Authorization: `Bearer ${token_f_get}`,
      },
    });

    if (response.data.success) {
      setCartItems(response.data.cartData);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error.message);
  }
};

const getProductData = async () => {
  try {
    const response = await axios.get(backendUrl+'/api/product/list')
    if(response.data.succes){
      setProducts(response.data.products);
    }else{
      toast.error(response.data.message)
    }
     
  } catch (error) {
    console.error('API Error:', error);
    toast.error(error.message);
  }
}
useEffect(()=>{
  getProductData()
},[])

useEffect(()=>{
  if (!token && localStorage.getItem('token')) {
    setToken(localStorage.getItem('token'))
    getUsercart(localStorage.getItem('token'))
  }
},[])

  const value = {
    products,
    currency,
    delivery_fee,
    search,showSearch,setSearch,setShowSearch,cartItems,addToCart,getCartCount,
    updateQuantity,getCartAmount,navigate,backendUrl,token,setToken,setCartItems
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;

