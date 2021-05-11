import { CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import {Field, FieldSet} from './CustomComponents';
import { useState, useEffect } from "react";
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
  
  const handleSubmit = async (event) => {
    //? Formulaire envoyé ? 
    
    //? La confirmation de paiement est en cours de validation
    setProcessing(true)
    
    //? On passe la valeur qui nous sert à désactiver le bouton de soumission du formulaire à true, pour ne pas le soumettre à nouveau par erreur
    setDisabled(true);

    event.preventDefault();

    //? On s'assure que les Hoooks ai chargés avant de continuer
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    //TODO: La création d'un élément from scratch ne fonctionne pas en l'état, approfondir le sujet exemple d'utilisation ici => : https://github.com/stripe/react-stripe-js/blob/9fe1a5473cd1125fcda4e01adb6d6242a9bae731/examples/hooks/4-IBAN.js
    //? Créer un élément =>: https://stripe.com/docs/js/elements_object/create_element?type=iban et le monter dans le DOM : https://stripe.com/docs/js/element/mount
    // const ibanElement = elements.getElement(IbanElement);
   
    console.log(
      "1)=>",cardElement,
      // "2)=>", ibanElement,
    );

    //? possible de créer directement les variables en destructurant l'objet promise que retourne la méthode :  https://stripe.com/docs/js/payment_methods/create_payment_method
    //? Doc: server.js + CheckoutForm.jsx : https://stripe.com/docs/payments/integration-builder
    
    //! Privilégier "confirmCardPayment" à "createPaymentMethod", car elle valide directement l'intention de paiement et crée la méthode de paiement, mais il faut passer la clé secrète de l'utilisateur en arg1 (useEffect: appel API => récupération de la clé => stockage state => utilisation).
    //? https://stripe.com/docs/js/payment_intents/confirm_card_payment
    const {paymentIntent, error} = await stripe
      .confirmCardPayment(clientSecret,{
        payment_method: {
            card: cardElement,
            billing_details: {
                
              name: name,
            },
        },
        receipt_email: email,
      })
                                                                    //! OU
      //? Utilisation de méthode en provenance de l'api Stripe.Js, créer une méthode de paiement (Préférer confirmCardPayment) : https://stripe.com/docs/js/payment_methods/create_payment_method
      // const payload = await stripe.createPaymentMethod({
      //   type: 'card', //? Valeurs possibles pour le type : https://stripe.com/docs/api/payment_methods/create#create_payment_method-type
      //   billing_details: {
      //     name,
      //     email,
      //   },
      // });

	  //? Sans destructuration, Il faudra donc passer par payload. error / paymentMethod pour obtenir les valeurs retour
    if (error) {

      //? Si la variable "error" a été créée on l'affiche - Vrai utilisation => stockage state
      console.log('[error]', error.message);
      setError(error.message);
      
    } else {

      //? - Vrai utilisation => stockage state
      //? Si le paiement réussit, un objet payment_intent est créer dans cette variable, avec une propriété " status: "succeeded" "
      console.log('2)=> [PaymentIntent]', paymentIntent);
      setSucceeded("Merci pour votre paiement, à bientôt sur FitLab")
      setProcessing(false)

    }
  }

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

        <Field type="text" id="name" placeholder="Jean Dupont" valueFromState={name} onChange={event=> {setName(event.target.value)}}>Name</Field>
        <Field type="email" id="email" placeholder="jeandupont@gmail.com" valueFromState={email} onChange={event=> {setEmail(event.target.value)}}>Email</Field>
        <Field type="number" id="phone" placeholder="+33 078545..." valueFromState={phone} onChange={event=> {setPhone(event.target.value)}}>Phone</Field>

      </FieldSet>

      <FieldSet plus='mt-8'>
        
        <div className=" p-2">

          <CardElement  options={CARD_OPTIONS}/>

        </div>

      </FieldSet>

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


