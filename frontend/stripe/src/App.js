import CheckoutForm from "./components/CheckoutForm";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
//? Crée une instance de l'objet Stripe : https://stripe.com/docs/js/initializing  nous permettant par la suite d'accéder à l'api entière de Stripe.JS
const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_API_KEY);
function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;
