import {loadStripe, Elements} from '@stripe/stripe-js';
import CheckoutForm from "./components/CheckoutForm";
const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_API_KEY);
function App() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default App;
