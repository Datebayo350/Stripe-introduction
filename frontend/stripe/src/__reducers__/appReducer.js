//? Un Reducer est une fonction qui prend deux paramètres : un state et une action et renvoie un state (le nouveau en cas de modifications, l'ancien si pas de modofications)
export const appReducer = (previousState, action) => {
  switch (action.type) {
    //? Objectif = modifier le rendu de l'application en fonction des actions émises par la fonction dispatch
    case "INCREMENT_PREMIUM_COUNTER":
      return {
        //? Copie de l'ancien state
        ...previousState,
        //? Et modification uniquement de la propriété voulue
        //! Pour les valeurs booléennes ça sera  : différent (exemple : !true) de la valeur initiale 
        premiumCounter: previousState.premiumCounter + 1
      };

    case "DECREMENT_PREMIUM_COUNTER":
      return {
        ...previousState,
        premiumCounter: previousState.premiumCounter - 1
      };

    case "INCREMENT_SILVER_COUNTER":
      return {
        ...previousState,
        silverCounter: previousState.silverCounter + 1
      };

    case "DECREMENT_SILVER_COUNTER":

      return {
        ...previousState,
        silverCounter: previousState.silverCounter - 1
      };

    case "SUBSCRIPTION_SELECTED":

      return {
        ...previousState,
        subscriptionSelected: action.payload.subscription,
        //? Grise les boutons de selection abonnement une fois l'un d'entre eux choisit
        disabled: true,
        customerPurchaseData: { customerId: previousState.customer.id, productPriceObject: action.payload.objectPriceId, productQuantity: previousState.quantity }
      };

    case "RECORD_EURO_PER_SEAT":

      return {
        ...previousState,
        euro: action.payload
      };

    case "RECORD_TOTAL_AMOUNT_TO_PAY":

      return {
        ...previousState,
        totalAmountToPay: action.payload
      };

    case "RECORD_PRODUCT_QUANTITY":

      return {
        ...previousState,
        productQuantity: action.payload
      };

    case "RECORD_CUSTOMER_PURCHASE_DATA":
      // console.log("EVT ENREGISTREMENT DONNES",previousState.productQuantity);
      return {
        ...previousState,
        customerPurchaseData: { customerId: previousState.customer.id, productPriceObject: action.payload.priceObjectId, productQuantity: previousState.productQuantity }

      };

    case "RECORD_PAYMENT_METHOD_INFOS":
      console.log("reducer - payment methode id", action.payload.paymentMethodId);
      return {
        ...previousState,
        paymentMethodId: action.payload.paymentMethodId
      };
  }
  //? Quelque soit l'action passée, un state sera toujours renvoyé à la fin, le nouveau ou bien l'ancien 
  //? Pour ne pas introduire d'effets de bord indésirables lors du return, on va envoyé un state "muté" = on copie ce que contient l'ancien et on rajoute les nouveaux éléments (ou modification uniquement certains)
  return previousState;

}