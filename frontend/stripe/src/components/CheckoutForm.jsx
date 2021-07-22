import {
  SET_DISABLED,
  RECORD_ERROR,
  ON_CHANGE,
  RECORD_PAYMENT_METHOD_ID,
  RECORD_CUSTOMER_SECRET,
  RECORD_PAYMENT_SUCCESS,
  RECORD_PAYMENT_PROCESSING,
}
  from "./../__actions__"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Field, FieldSet } from './CustomComponents';
import { useEffect, useContext } from "react";
import { appContext } from "./../__contexts__";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./../App.css"
import attentionLogo from "./../attentionLogo.png";

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

  const history = useHistory();
  
  const globalContext = useContext(appContext);

  const { state, dispatch } = globalContext;

  const getClientSecret = async () => {
    try {
      //? On appel l'API Rest qui s'occupe de créer une intention de paiement
      const secretClientCall = await axios.post("http://localhost:5000/api/intents/create", {
        //! Propriété obligatoire pour créer une intention de paiement
        amount: state.stripeAmount, //? Toujours rajouter 2 "zero" pour obtenir le chiffre souhaité car stripe crée des prix avec des nombres décimaux 
        //! Propriété obligatoire pour créer un paiement
        currency: "eur",
        //! Propriété Optionnelle
        customer: state.customerData.id, //? Si on ne renseigne pas le client avec son ID, les informations personnelles de l'utilisateur ayant effectué le paiement seront celles rentrées par le client dans le formulaire
        payment_method_types: ['card'],
        //? Cette propriété permet d'attacher la méthode de paiement qui résoudra cette l'intention de paiement que l'on crée ici directement  au profile du client, ainsi il pourra la ré-utiliser  par la suite ( prélévements automatiques pour abonnements etc ...)
        setup_future_usage: "off_session",
      });

      //? Promesse résolue, le client HTTP Axios nous renvoie directement un objet JSON, pas besoin de le stringifier
      const secret = secretClientCall.data.secret;

      //? On stock la clé secrète de l'intention de paiement
      dispatch({ type: RECORD_CUSTOMER_SECRET, payload: secret });
    }

    catch (e) {
      console.log(e);
    }

  };

  const createSubscription = async (customerId, priceObjectId, paymentMethodId, productQuantity) => {
    const items = [
      { price: priceObjectId, quantity: productQuantity }
    ];

    try {
      await axios.post("http://localhost:5000/api/subscriptions/create", {
        data: {
          customerId,
          items,
          paymentMethodId,
        }
      });
    }

    catch (e) {
      console.log("Erreur Création et Attachement méthode paiement =>", e);
    }

  };

  const handleSubmit = async (event) => {
    //? Formulaire envoyé ? 
    event.preventDefault();
    
    const cleanErrorArray = "";
    dispatch({ type: RECORD_ERROR, payload: cleanErrorArray });

    //? Si tous les champs du formulaire on été renseignés
    if (state.paymentEmail.length && state.paymentName.length && state.paymentPhone.length > 5) {
      dispatch({ type: RECORD_ERROR, payload: cleanErrorArray });

      if (state.customerPurchaseData.customerId.length > 1) {

        //? On s'assure que les Hoooks ai chargés avant de continuer
        if (!stripe || !elements) {
          return;
        }

        //? On attend la réponse de Stripe concernant le paiement
        dispatch({ type: RECORD_PAYMENT_PROCESSING });

        //? On désactive le bouton de soumission du formulaire en passant "disabled" à "true", pour ne pas le soumettre à nouveau par erreur
        dispatch({ type: SET_DISABLED })

        //? On récupère la référence du composant Stripe "CardElement" 
        const cardElement = elements.getElement(CardElement);

        //TODO: La création d'un élément from scratch ne fonctionne pas en l'état, approfondir le sujet exemple d'utilisation ici => : https://github.com/stripe/react-stripe-js/blob/9fe1a5473cd1125fcda4e01adb6d6242a9bae731/examples/hooks/4-IBAN.js

        //? Créer un élément =>: https://stripe.com/docs/js/elements_object/create_element?type=iban et le monter dans le DOM : https://stripe.com/docs/js/element/mount

        //? Possible de créer directement les variables en destructurant l'objet promise que retourne la méthode :  https://stripe.com/docs/js/payment_methods/create_payment_method
        //? Doc: server.js + CheckoutForm.jsx : https://stripe.com/docs/payments/integration-builder

        //! Privilégier "confirmCardPayment" à "createPaymentMethod", car elle valide directement l'intention de paiement et créée la méthode de paiement, mais il faut passer la clé secrète de l'utilisateur en arg1 (useEffect: appel API => récupération de la clé => stockage state => utilisation).
        //? https://stripe.com/docs/js/payment_intents/confirm_card_payment

        //? "paymentIntent" représente : L'intention de paiement confirmée
        const { paymentIntent, error } = await stripe
          .confirmCardPayment(state.customerSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: state.paymentName,
              },
            },
            receipt_email: state.paymentEmail,
          })

        if (error) {
        console.log(state.error);
          //? Si le paiement a échoué, Afficher l'erreur à l'écran et ré-activer l'envoi du formulaire afin que le client puisse re-tenter le paiement
          dispatch({ type: RECORD_ERROR, payload: cleanErrorArray });
          dispatch({ type: RECORD_ERROR, payload: error.message });
          dispatch({ type: RECORD_PAYMENT_PROCESSING });


        } else {

          const paymentMethodId = paymentIntent.payment_method;

          dispatch({ type: RECORD_ERROR, payload: cleanErrorArray });

          const message = "Merci pour votre paiement, à bientôt sur FitLab";
          dispatch({ type: RECORD_PAYMENT_SUCCESS, payload: message });

          dispatch({ type: RECORD_PAYMENT_PROCESSING });
          dispatch({ type: RECORD_PAYMENT_METHOD_ID, payload: { paymentMethodId } });

        }
      } else {

        dispatch({ type: RECORD_ERROR, payload: cleanErrorArray });

        const message = "Il faut choisir un abonnement, retournez sur la page home";
        dispatch({ type: RECORD_ERROR, payload: message });
      }
    } else {
      const message = "Il faut remplire les champs du formulaire : nom, email, téléphone";
      dispatch({ type: RECORD_ERROR, payload: message });
    }
  }

  useEffect(() => {
    console.log("Error longueur", state.error.errorMessage.length);
    console.log("Error contenu", state.error.errorMessage);
    //? Résolution d'erreur => :
    //? index.js:1 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function. at CheckoutForm
    //! https://www.debuggr.io/react-update-unmounted-component/

    //? On remet la valeur de "disabled" à "false" une fois arrivé sur cette page, car on aura besoin de réaliser un traitement différent au click sur le bouton de paiement 
    if (state.disabled) {
      
      dispatch({ type: SET_DISABLED })
    }

    //? Si l'id de l'user est renseigné cela veut dire qu'un abonnement a été choisit
    if (state.customerPurchaseData.customerId.length > 1) {
      //? Quand le client arrive sur la page, on crée automatiquement une intention de paiement qu'on viendra confirmer lors de la soumission du formulaire
      getClientSecret();
      
      //? Si l'id de la méthode de paiement existe, on créer l'abonnement 
      if (state.paymentMethodId.length > 1) {

        createSubscription(
          state.customerPurchaseData.customerId,
          state.customerPurchaseData.productPriceObject,
          state.paymentMethodId,
          state.customerPurchaseData.productQuantity
        );
        history.push("/payment-success")
      } 

    } else {

      const cleanErrorArray = "";
      dispatch({ type: RECORD_ERROR, payload: cleanErrorArray });

      const message = "Il faut choisir un abonnement, retournez sur la page home";
      dispatch({ type: RECORD_ERROR, payload: message });
    }

  }, [state.paymentMethodId, state.processing]);


  //TODO: Si une methode de paiement est définie dans le state on remet les valeurs du state à 0 en cliquant sur un bouton 
  const reset = () => {
    // setClientSecret("");
    // setSucceeded("");
    // setDisabled(false);
    // setProcessing(false);
    // setEmail("");
    // setPhone("");
    // setError([]);
    // setName("");;

  };

  //? Version améliorée d'un rendu en fonction de l'existence d'une méthode de paiement : https://github.com/stripe/react-stripe-js/blob/9fe1a5473cd1125fcda4e01adb6d6242a9bae731/examples/hooks/1-Card-Detailed.js

  return (
    <>

      <div className="flex flex-col items-center ">

        {state.error.errorMessage.length > 1 &&
          <div className="mt-32 font-bold max-h-6 max-w-full flex justify-center">
            <img className="attention" src={attentionLogo} alt="Icône d'avertissement" />
            <p className="ml-6">{state.error.errorMessage}</p>
          </div>
        }
        <form onSubmit={handleSubmit} className="mt-0 overflow-auto container mx-auto  my-60 w-5/12 p-20 flex-direction-column">

          <FieldSet >

            <Field type="text" id="name" placeholder="Jean Dupont" name="paymentName" onChange={event => { dispatch({ type: ON_CHANGE, payload: event.target }) }}>Name</Field>

            <Field type="email" id="email" placeholder="jeandupont@gmail.com" name="paymentEmail" onChange={event => { dispatch({ type: ON_CHANGE, payload: event.target }) }}>Email</Field>

            <Field type="number" id="phone" placeholder="+33 078545..." name="paymentPhone" onChange={event => { dispatch({ type: ON_CHANGE, payload: event.target }) }}>Phone</Field>

          </FieldSet>

          <FieldSet plus='mt-8'>

            <div className=" p-2">

              <CardElement options={CARD_OPTIONS} />

            </div>

          </FieldSet>
          {state.processing
            ?
            <button type="button" className="button flex mx-auto max-h-12 p-3 w-full mt-10 justify-self-center button shadow-2xl rounded-md font-bold text-white" disabled>
              Processing
              <div className=" ml-5 animate-spin h-5 w-5 mr-3 bg-white rounded-lg mb-96" ></div>
            </button>
            :
            <button type="submit" disabled={state.disabled} className="p-3 w-full mt-10 justify-self-center button shadow-2xl rounded-md font-bold text-white"> { }Payer
            </button>

          }
        </form>

        {state.paymentSucceeded.lenght > 0 &&
          <h2 className="bg-red-200" >{state.paymentSucceeded}</h2>
        }
      </div>



    </>
  );
}


