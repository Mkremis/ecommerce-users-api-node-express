import mercadopago from "mercadopago"



export const createOrder = async (req, res)=>{
    mercadopago.configure({
        access_token: 'TEST-5530375809049094-060611-aea998a2225643c110e407efb3cd8a46-1392033041'
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

export const receiveWebhook = (req, res)=>{
    console.log(req.query)
    res.send('webhook')
};