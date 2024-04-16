import db from "../index.js";

export const registerUserPurchaseService = async ({ userId, paymentData }) => {
  try {
    const items = paymentData?.additional_info?.items;
    if (!userId || !items) return;
    const transactionData = {
      _id: paymentData.order.id,
      userId,
      transaction_date: paymentData.date_approved,
      payment_method: paymentData.payment_method.type,
      total_paid_amount: paymentData.transaction_details.total_paid_amount,
      shipping_amount: paymentData.shipping_amount,
      card_number: paymentData.card.last_four_digits,
      status_detail: paymentData.status_detail,
      order_type: paymentData.order.type,
      _id: paymentData.order.id,
      currency_id: paymentData.currency_id,
    };
    const purchasedItems = items.map((item) => {
      return {
        prodId: item.id,
        order_id: paymentData.order.id,
        prodName: item.title,
        prodPrice: item.unit_price,
        currency_id: "USD",
        prodImage: item.picture_url,
        prodGender: item.category_id,
        productQ: item.quantity,
      };
    });
    await db.createTransaction({ transactionData });
    await db.createPurchase({ userId, purchasedItems });
  } catch (error) {
    console.error("Error registering purchase:", error);
    throw error;
  }
};

export const getUserPurchasesService = async ({ userId }) => {
  try {
    const purchases = await db.getPurchasesByUserId({ userId });
    return { success: purchases };
  } catch (error) {
    console.error("Error getting purchases:", error);
    throw error;
  }
};
export const getPurchasesByTrIdService = async ({ userId, transactionId }) => {
  try {
    const purchases = await db.getPurchasesByTrId({ userId, transactionId });
    return { success: purchases };
  } catch (error) {
    console.error("Error getting purchases:", error);
    throw error;
  }
};
