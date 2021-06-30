import { 
  RECORD_PAYMENT_PROCESSING,
  SET_DISABLED,
  RECORD_CUSTOMER_SECRET,
}
from "./../__actions__"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Field, FieldSet } from './CustomComponents';
import { useEffect, useContext } from "react";
import { appContext } from "./../__contexts__";
import axios from "axios";
import "./../App.css"

//? Objet Style permettant de styliser un Stripe Element: https://stripe.com/docs/js/appendix/style, syntaxe vue ici : https://github.com/stripe/react-stripe-js/blob/9fe1a5473cd1125fcda4e01adb6d6242a9bae731/examples/hooks/4-IBAN.js
const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#3f1414",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {
        color: "#fce883"
      },
      "::placeholder": {
        color: "#FEE2E2"
      }
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee"
    }
  }
};

export default function CheckoutForm() {

  //? Permet d'accéder à toutes les méthodes de l'API Stripe.JS : https://stripe.com/docs/js, https://stripe.com/docs/stripe-js/react#usestripe-hook
  //? Ce Hook retourne une référence de l'objet Stripe passé au provider Element dans App.js : https://stripe.com/docs/js/initializing
  const stripe = useStripe();

  //? Permet de récupérer la référence d'un Stripe Element : https://stripe.com/docs/stripe-js/react#useelements-hook  
  //? Ce Hook saura reconnaître de quel Element il s'agit car il n'est possible d'utiliser qu'une seul fois le même par page, liste des Stripe Elements disponible ici => : https://stripe.com/docs/stripe-js/react#available-element-components
  const elements = useElements();

  const globalContext = useContext(appContext);

  const {state, dispatch} = globalContext;
   //? Quand le client arrive sur la page, on crée automatiquement une intention de paiement qu'on viendra confirmer lors de la soumission du formulaire
  const getClientSecret = async () => {
    try {
      //? On appel l'API Rest qui s'occupe de créer une intention de paiement et on lui fournit les informations requises pour cela 
      const secretClientCall = await axios.post("http://localhost:5000/api/intents/create", {
        //! Propriété obligatoire pour créer une intention de paiement
        amount: state.stripeAmount, //? Toujours rajouter 2 "zero" pour obtenir le chiffre souhaité car stripe crée des prix avec des nombres décimaux 
        //! Propriété obligatoire pour créer un paiement
        currency: "eur",
        //! Propriété Optionnelle
        customer: state.customerData.id, //? Si on ne renseigne pas le client avec son ID, les informations personnelles de l'utilisateur ayant effectué le paiement seront celles rentrées par le client dans le formulaire
      })

      //? Promesse résolue, le client HTTP Axios nous renvoie directement un objet JSON, pas besoin de le stringifier
      const secret = secretClientCall.data.secret;

      //? On stock la clé secrète de l'intention de paiement
      dispatch({ type:RECORD_CUSTOMER_SECRET, payload:secret });
    }

    catch (e) {
      console.log(e);
    }

  };  

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
      <form onSubmit={handleSubmit} className=" overflow-auto  container mx-auto my-60 w-5/12 p-20 flex-direction-column">

        <FieldSet >

          <Field type="text" id="name" placeholder="Jean Dupont" valueFromState={name} onChange={event => { setName(event.target.value) }}>Name</Field>
          <Field type="email" id="email" placeholder="jeandupont@gmail.com" valueFromState={email} onChange={event => { setEmail(event.target.value) }}>Email</Field>
          <Field type="number" id="phone" placeholder="+33 078545..." valueFromState={phone} onChange={event => { setPhone(event.target.value) }}>Phone</Field>

        </FieldSet>

        <FieldSet plus='mt-8'>

          <div className=" p-2">

            <CardElement options={CARD_OPTIONS} />

          </div>

        </FieldSet>

        <button type="submit" disabled={state.disabled} className="p-3 w-full mt-10 justify-self-center button shadow-2xl rounded-md font-bold text-white"> Payer </button>
      </form>

      {state.processing &&
        <button type="button" className="bg-rose-600 ... flex p-2 content-around font-bold" disabled>
          Processing
          <div className=" ml-5 animate-spin h-5 w-5 mr-3 bg-white rounded-lg mb-96" ></div>
        </button>
      }

      {state.paymentSucceeded &&
        <h2 >
          {state.paymentSucceeded}
        </h2>
      }

      {error &&
        <div >
          {error}
        </div>
      }
    </>
  );
}


