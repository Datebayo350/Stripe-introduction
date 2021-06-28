//? "appState" contiendra l'état par défaut de notre state
export const appState = {

    //? Cette partie du state remplace les variables de state de CheckoutForm
    clientSecret: String,
    succeeded: String,
    disabled: false,
    processing: false,
    email: String,
    phone: String,
    error: [],
    name: String,
    //?-----------------------------
    
    //? Cette partie du state remplace les variables de state de Home
    customer: { id: "cus_JVP8OqKZ2LXm53", name: String, email: String, phone: Number, },
    subscriptionSelected: String,
    paymentIntentId: String,
    paymentMethodId: String,
    totalAmountToPay: 0,
    productQuantity: 0,
    euro: 0,
    customerPurchaseData: { customerId: String, productPriceObject: String, productQuantity: Number },

    premiumProductName: String,
    premiumProductId: "prod_JV2EPpQRXgMOyd",
    premiumImage: String,
    premiumCounter: 0,
    premiumPriceId: "price_1ItC4zLG9PLRTQCEN8TrdSEG",
    
    silverProductName: String,
    silverProductId: "",
    silverImage: String,
    silverCounter: 0,
    silverPriceId: "price_1J06T9LG9PLRTQCENyRoJoq6",
  };