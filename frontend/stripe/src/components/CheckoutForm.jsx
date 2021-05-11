import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import "./../App.css"
 

export default function CheckoutForm () {
  
  //? Si pas de destructuration lors de la création de la méthode de paiement, ces hooks sont une possibilité|
  //const [paymentMethod, setPaymentMethod] = useState(null);//?                                             |
  //const [error, setError] = useState(null);//?                                                             |
  //? -------------------------------------------------------------------------------------------------------|
  const [clientSecret, setClientSecret] = useState("");
  const [succeeded, setSucceeded] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail ] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState([]);
  const [name, setName] = useState("");
  
 
  //? Permet d'accéder à toutes les méthodes de l'API Stripe.JS : https://stripe.com/docs/js, https://stripe.com/docs/stripe-js/react#usestripe-hook
  //? Ce Hook retourne une référence de l'objet Stripe passé au provider Element dans App.js : https://stripe.com/docs/js/initializing
  const stripe = useStripe();

  //? Permet de récupérer la référence d'un Stripe Element : https://stripe.com/docs/stripe-js/react#useelements-hook  
  //? Ce Hook saura reconnaître de quel Element il s'agit car il n'est possible d'utiliser qu'une seul fois le même par page, liste des Stripe Elements disponible ici => : https://stripe.com/docs/stripe-js/react#available-element-components
  const elements = useElements();
  
  //? Nous pouvons transmettre ces Hooks à travers les props de l'élément "Elements" parent au besoin,
  // const {stripe, elements} = this.props;

  useEffect( () => {
    //? Quand le client arrive sur la page, on crée automatiquement une intention de paiement qu'on viendra confirmer lors de la soumission du formulaire
    async function getClientSecret () {
      try {
        //? On appel notre API personnelle qui s'occupe de créer une intention de paiement et on lui fourni les informations requises pour cela 
        const secretClientCall =  await axios.post("http://localhost:5000/api/intents/create",{
          //! Propriété obligatoire pour créer une paiement
          amount: "700000", //? Toujours rajouter 2 "zero" pour obtenir le chiffre souhaité car stripe crée des prix avec des nombres décimaux 
          //! Propriété obligatoire pour créer une paiement
          currency: "eur",
           //! Propriété Optionnelle
          customer: "cus_JSUynGjup4aRqD", //? Si je ne renseigne pas le client avec son ID, les informations personnelles de l'utilisateur ayant effectué le paiement seront celles rentrées par le client dans le formulaire
        })

        console.log(secretClientCall);
        
        //? Promesse résolue, le client HTTP Axios nous renvoie directement un objet JSON, pas besoin de le stringifier
        const secret = secretClientCall.data.secret;

        //? On stock la clé secrète de l'intention de paiement
        setClientSecret(secret)
      }

      catch(error) {
        console.log(error);
      }
    
    };
      
    getClientSecret();
    console.log(clientSecret);
  },[]);
  


  //TODO: Si une methode de paiement est définie dans le state on remet les valeurs du state à 0 en cliquant sur un bouton 
  const reset = () => {
    setClientSecret("");
    setSucceeded("");
    setDisabled(false);
    setProcessing(false);
    setEmail("");
    setPhone("");
    setError([]);
    setName("");;
  
  };
  
  //? Version améliorée d'un rendu en fonction de l'existence d'une méthode de paiement : https://github.com/stripe/react-stripe-js/blob/9fe1a5473cd1125fcda4e01adb6d6242a9bae731/examples/hooks/1-Card-Detailed.js
  return (
    <>
    <form  className=" overflow-auto  container mx-auto my-60 w-5/12 p-20 flex-direction-column">
      
      <h1>Checkout Form</h1>

      <button type="submit" disabled={disabled} className="p-3 w-full mt-10 justify-self-center button shadow-2xl rounded-md font-bold text-white"> Payer </button>
    </form>
    
    {processing && 
      <button type="button" className="bg-rose-600 ... flex p-2 content-around font-bold" disabled>
      Processing
        <div className=" ml-5 animate-spin h-5 w-5 mr-3 bg-white rounded-lg mb-96" ></div>
      </button>
    }

    {succeeded && 
      <h2 >
       {succeeded} 
      </h2>
    }  
    {error  && 
      <div >
       {error} 
      </div>
    }  
    </>
  );
}


