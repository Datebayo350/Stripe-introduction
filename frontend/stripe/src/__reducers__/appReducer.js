//? Un Reducer est une fonction qui prend deux paramètres : un state et une action et renvoie un state (le nouveau en cas de modifications, l'ancien si pas de modofications)
export const appReducer = (previousState, action) => {
  switch (action.type) {
    //? Objectif = modifier le rendu de l'application en fonction des actions émises par la fonction dispatch
    case "RECORD_ERROR": 
      return {
        ...previousState,
        error: action.payload
      };
    
    case "SET_DISABLED":
      
      return {
        //? Copie de l'ancien state
        ...previousState,
        //? Et modification uniquement de la propriété voulue
        //! Pour les valeurs booléennes ça sera  : différent (exemple : !true) de la valeur initiale 
        disabled: !previousState.disabled,
      };

    case "RECORD_PAYMENT_INTENT_ID":
      return {
        ...previousState,
        paymentIntentId: action.payload.paymentIntentId,
      };
      
    case "RECORD_CUSTOMER_SECRET": 
      return {
        ...previousState,
        customerSecret: action.payload
      };
    
    case "RECORD_CUSTOMER_DATA":
      return {
        ...previousState,
        customerData: {
          id: action.payload.id, 
          name: action.payload.name, 
          email: action.payload.email, 
          phone: action.payload.phone, 
        }
      };
    
    //! Element à revoir
    case "RECORD_SUBSCRIPTION_SELECTED":
      return {
        ...previousState,
        subscriptionSelected: action.payload.subscription,
        //? Désactive les boutons de selection abonnement une fois l'un d'entre eux choisit
        //? Désactive le bouton de paiement finale après avoir déjà cliqué dessus 1 fois 
        productQuantity: action.payload.productQuantity,
        //! L'enregistrement de la propriété productQuantity risque de ne pas passer étant donné qu'on se base sur le previous.state et que la propriété du même nom dans le state est définie ici
        customerPurchaseData: { customerId: previousState.customerData.id, productPriceObject: action.payload.objectPriceId, productQuantity: action.payload.productQuantity }
      };
    
    case "RECORD_EURO_PER_SEAT":

      return {
        ...previousState,
        euroPerSeat: action.payload
      };

    //! Surrêment pas utile
    case "RECORD_PRODUCT_QUANTITY":

      return {
        ...previousState,
        productQuantity: action.payload
      };
   
    case "RECORD_TOTAL_AMOUNT_TO_PAY":

      return {
        ...previousState,
        totalAmountToPay: action.payload,
        stripeAmount:action.payload * 100,

      };
    
    case "INCREMENT_PREMIUM_COUNTER":
      return {
        ...previousState,
        premiumProductCounter: previousState.premiumProductCounter + 1
      };
    
    case "DECREMENT_PREMIUM_COUNTER":
      return {
        ...previousState,
        premiumProductCounter: previousState.premiumProductCounter - 1
      };

    case "INCREMENT_SILVER_COUNTER":
      return {
        ...previousState,
        silverProductCounter: previousState.silverProductCounter + 1
      };

    case "DECREMENT_SILVER_COUNTER":

      return {
        ...previousState,
        silverProductCounter: previousState.silverProductCounter - 1
      };
    
    case "RECORD_PRODUCTS":
      return {
        ...previousState,
        products: action.payload
      };   

    case "RECORD_PRICES":
      return {
        ...previousState,
        prices: action.payload
      };

    case "RECORD_PRODUCTS_DATA":
      return {
        ...previousState,
        premiumProductName: action.payload.premium.premiumProductName,
        premiumProductId: action.payload.premium.premiumProductId,
        premiumProductImage: action.payload.premium.premiumProductImage,
        silverProductName: action.payload.silver.silverProductName,
        silverProductId: action.payload.silver.silverProductId,
        silverProductImage: action.payload.silver.silverProductImage,

      };

    case "RECORD_PRICES_DATA":
      return {
        ...previousState,
        premiumPriceId: action.payload.premium.premiumPriceId,
        silverPriceId: action.payload.silver.silverPriceId,
        pricesData: [...previousState.pricesData, action.payload.premium.premiumProductPrice, action.payload.silver.silverProductPrice]
      };
    
    case "RECORD_PAYMENT_DATA":
      return {
        ...previousState,
        paymentMethodId: action.payload.paymentMethodId,
        paymentEmail:action.payload.paymentEmail,
        paymentPhone:action.payload.paymentPhone,
        paymentName:action.payload.paymentName,
      };
    
    case "RECORD_PAYMENT_PROCESSING":
      return {
        ...previousState,
        processing: !previousState.processing
      };
    
    case "RECORD_PAIMENT_SUCCESS": 
      return {
        ...previousState,
        paymentSucceeded: action.payload
      };
  }
  //? Quelle-que soit l'action passée, un state sera toujours renvoyé à la fin, le nouveau ou bien l'ancien. 
  //? Pour ne pas introduire d'effets de bord indésirables lors du return, on va renvoyer un state "muté" = on copie ce que contient l'ancien et on rajoute les nouveaux éléments (ou modification uniquement certains)
  return previousState;

}