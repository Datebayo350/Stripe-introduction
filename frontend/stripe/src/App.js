import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { CheckoutForm, Success, Cancel, Home, CustomNavbar, Login } from "./components";
import { useReducer } from "react";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AppContext from './__contexts__/AppContext.jsx';
import "./App.css"

//? Crée une instance de l'objet Stripe : https://stripe.com/docs/js/initializing  nous permettant par la suite d'accéder à l'api entière de Stripe.JS
const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_API_KEY);
function App() {

  //! Utilisation de useReducer 
  //? appReducer = Etat par défaut de l'application 
  //? dispatch = a chaque fois que cette fonction va être utilisé, le reducer va être appelé avec : le previous state de l'application qui est au départ initialState + l'action dispatché, il prend les deux et il calcule le nouveau state  

  const initialState = {
    //? initialState = Va contenir ce les valeurs par défaut dans notre state
    //? CheckoutForm
    clientSecret: String,
    succeeded: String,
    disabled: false,
    processing: false,
    email: String,
    phone: String,
    error: [],
    name: String,
    //?-----------------------------

    //? Home
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
  }

  //? Un Reducer va toujour être une fonction qui prend deux paramètres : un state et une action et renvoie toujours un nouveau state
  const appReducer = (previousState, action) => {
    switch (action.type) {
      //? Objectif = modifier le rendu de l'application en fonction des actions dispatch
      case "INCREMENT_PREMIUM_COUNTER":
        return {
          //? Copie de l'ancien state
          ...previousState,
          //? Et modification uniquement de la propriété voulue
          //! Pour les valeurs booléennes ça sera  : différent de la valeur initiale 
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
          disabled:true,
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
        }
    }
    //? Quelque soit l'action passée, le state sera toujours renvoyé à la fin, le nouveau ou bien l'ancien 
    //? Pour ne pas introduire d'effets de bord indésirables lors du return, on va envoyé un state "muté" = on copie ce que contient l'ancien et on rajoute les nouveaux éléments (ou modification uniquement certains)
    return previousState;
  }
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (

    <AppContext.Provider value={{ state: state, dispatch: dispatch, }}>
      <Elements stripe={stripePromise}>
        <Router>
          <CustomNavbar />
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/payment-success" exact={true} component={Success} />
            <Route path="/checkout-form" exact={true} component={CheckoutForm} />
            <Route path="/payment-cancel" exact={true} component={Cancel} />
            <Route path="/login" exact={true} component={Login} />
          </Switch>
        </Router>
      </Elements>
    </AppContext.Provider>
  );
}

export default App;
