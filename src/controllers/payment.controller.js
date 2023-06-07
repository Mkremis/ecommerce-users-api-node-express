import mercadopago from "mercadopago"
import {MERCADOPAGO_API_KEY} from '../config.js'
import { cartUpdate } from "../services/cart.js";

export const createOrder = async (req, res)=>{
  const username = req.user.login_username;
  const order = req.body;
  let cartItems = [];
  for (const key in order) {
    let obj = {};
    if(parseInt(order[key]["productQ"]) > 0){
      obj.title = order[key]["prodName"];
      obj.quantity = parseInt(order[key]["productQ"]); 
      obj.currency_id = 'USD';
      obj.unit_price = parseFloat(order[key]["prodPrice"]);
      cartItems.push(obj);
    }
  }

    mercadopago.configure({
        access_token: MERCADOPAGO_API_KEY
    });
    try {
      const result = await mercadopago.preferences.create({
        items: cartItems,
          back_urls:{
            success: `https://ecommerce-users-api-production.up.railway.app/api/success/${username}`,
            pending: "https://ecommerce-users-api-production.up.railway.app/api/pending",
            failure: "https://ecommerce-users-api-production.up.railway.app/api/failure"
          },
          notification_url: "https://ecommerce-users-api-production.up.railway.app/api/webhook",
          
    })
    res.json(result.body)
    } catch (error) {
      res.status(500).json({message: error})
    }

};



export const success = (req, res)=>{
  const {username} = req.params;
  const cart = JSON.stringify({});
  cartUpdate(username,cart);
  }
export const failure = (req, res)=>{res.send('Failure!')}
export const pending = (req, res)=>{res.send('Pending..')}

export const receiveWebhook = async (req, res)=>{
  const payment = req.query;
 try {
  if(payment.type === 'payment'){
    const data = await mercadopago.payment.findById(payment['data.id']);
    // console.log('webhook',data)
    res.status(204).json({data})
  }
 } catch (error) {
  return res.status(500).json({error: error.message})
  
 }
};