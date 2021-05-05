import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.REACT_APP_PUBLIC_API_KEY);
console.log(Elements);
function App() {
  return (
    <Elements stripe={stripePromise}>
    </Elements>
  );
}

export default App;
