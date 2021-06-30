//? "appState" contiendra l'état par défaut de notre state
export const appState = {

  disabled: false,
  //? Cette partie du state remplace les variables de state de CheckoutForm
  paymentMethodId: String,
  paymentEmail: String,
  paymentPhone: String,
  paymentName: String,
  error: [], 
  processing: false,
  customerSecret: String,
  paymentSucceeded: String,
  //?-----------------------------
  
  //? Cette partie du state remplace les variables de state de Home
  customerData: { id: "cus_JVP8OqKZ2LXm53", name: String, email: String, phone: Number, },
  paymentIntentId: String,
  subscriptionSelected: String,
  totalAmountToPay: 0,
  productQuantity: 0,
  euroPerSeat: 0,
  customerPurchaseData: { customerId: String, productPriceObject: String, productQuantity: Number },

  premiumProductName: String,
  premiumProductId: String,
  premiumProductImage: String,
  premiumProductCounter: 0,
  premiumPriceId: String,
  
  silverProductName: String,
  silverProductId:String,
  silverProductImage: String,
  silverProductCounter: 0,
  silverPriceId: String,

  prices:{}, 
  pricesData:[],
  products:{} 
};