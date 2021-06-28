import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { useReducer, useContext } from "react";
import { CheckoutForm, Success, Cancel, Home, CustomNavbar, Login } from "./components";
import { appReducer } from "./__reducers__";
import { appContext } from "./__contexts__";
import { appState } from "./__states__";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import "./App.css"

//? Crée une instance de l'objet Stripe : https://stripe.com/docs/js/initializing  nous permettant par la suite d'accéder à l'api entière de Stripe.JS

const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_API_KEY);
function App() {
  //! --Utilisation de useReducer-- 
  //? appState = Etat par défaut de l'application 
  //? dispatch = Fonction utilisée pour éméttre des actions à l'intérieur du Reducer (ici : appReducer)
  //? le Reducer reçoit en paramètre l'état initial de l'application (appState) et une action (émise par la fonction "dispatch"), en fonction de ces deux paramètres il calculera et retournera un nouveau state  

  const [state, dispatch] = useReducer(appReducer, appState);
  
  return (
    <appContext.Provider value={state}>
      <Elements stripe={stripePromise}>
        <Router>
          <CustomNavbar />
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/payment-success" exact={true} component={Success} />
            <Route path="/checkout-form" exact={true} component={CheckoutForm} />
            <Route path="/payment-cancel" exact={true} component={Cancel} />
             {/* <Route path="/login" exact={true} component={Login} /> */}
          </Switch>
        </Router>
      </Elements>
    </appContext.Provider>
  );
}

export default App;

