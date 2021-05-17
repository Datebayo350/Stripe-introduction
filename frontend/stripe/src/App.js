import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation
} from "react-router-dom";

import {CheckoutForm, Success, Cancel, Home, CustomNavbar} from "./components";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import "./App.css"

//? Crée une instance de l'objet Stripe : https://stripe.com/docs/js/initializing  nous permettant par la suite d'accéder à l'api entière de Stripe.JS
const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_API_KEY);
function App() {
  return (
    
      <Elements stripe={stripePromise}>
        <Router>
          <CustomNavbar/>
          <Switch>
            <Route path="/" exact={true} component={Home}/>
            <Route path="/payment-success" exact={true} component={Success}/>
            <Route path="/checkout-form" exact={true} component={CheckoutForm}/>
            <Route path="/payment-cancel" exact={true} component={Cancel}/> 
          </Switch>
        </Router>
      </Elements>
  );
}

export default App;
