import mercadopago from "mercadopago"
import {MERCADOPAGO_API_KEY} from '../config.js'

export const createOrder = async (req, res)=>{
  const order = req.body;
  let cartItems = [];
  for (const key in order) {
   let obj = {};
   obj.title = order[key]["prodName"];
   let q = order[key]["productQ"];
   obj.quantity = parseInt(q);
   obj.quantity_type = typeof obj.quantity;
   obj.currency_id = 'USD';
   let price = order[key]["prodPrice"]
   obj.unit_price = parseFloat(price);
   obj.price_type = typeof obj.unit_price;
   cartItems.push(obj)      
    };
  res.json({items: cartItems,})
    // mercadopago.configure({
    //     access_token: MERCADOPAGO_API_KEY
    // });
    // try {
    //   const result = await mercadopago.preferences.create({
    //     items: cartItems,
    //       back_urls:{
    //         success: "https://ecommerce-users-api-production.up.railway.app/api/success",
    //         pending: "https://ecommerce-users-api-production.up.railway.app/api/pending",
    //         failure: "https://ecommerce-users-api-production.up.railway.app/api/failure"
    //       },
    //       notification_url: "https://ecommerce-users-api-production.up.railway.app/api/webhook"
    // })
    // res.json(result.body)
    // } catch (error) {
    //   res.status(500).json({message: error})
    // }
};




export const failure = (req, res)=>{res.send('Failure!')}
export const pending = (req, res)=>{res.send('Pending..')}
export const success = (req, res)=>{res.send('Success')}

export const receiveWebhook = async (req, res)=>{
  const payment = req.query;
 try {
  if(payment.type === 'payment'){
    const data = await mercadopago.payment.findById(payment['data.id']);
    res.status(204).json({data})
  }
 } catch (error) {
  return res.status(500).json({error: error.message})
  
 }
};