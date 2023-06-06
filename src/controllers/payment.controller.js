import mercadopago from "mercadopago"
import {MERCADOPAGO_API_KEY} from '../config.js'

export const createOrder = async (req, res)=>{
    mercadopago.configure({
        access_token: MERCADOPAGO_API_KEY
    });
    const result = await mercadopago.preferences.create({
        items: [
            {
              title: 'Test',
              quantity: 1,
              currency_id: 'ARS',
              unit_price: 10.5
            }
          ],
          back_urls:{
            success: "https://ecommerce-users-api-production.up.railway.app/api/success",
            pending: "https://ecommerce-users-api-production.up.railway.app/api/pending",
            failure: "https://ecommerce-users-api-production.up.railway.app/api/failure"
          },
          notification_url: "https://ecommerce-users-api-production.up.railway.app/api/webhook"
    })
    res.send(result.body)
};
export const failure = (req, res)=>{res.send('Failure!')}
export const pending = (req, res)=>{res.send('Pending..')}
export const success = (req, res)=>{res.send('Success')}

export const receiveWebhook = async (req, res)=>{
  const payment = req.query;
 try {
  if(payment.type === 'payment'){
    const data = await mercadopago.payment.findById(payment['data.id']);
    res.statu(204).json({data})
  }
 } catch (error) {
  return res.status(500).json({error: error.message})
  
 }
};