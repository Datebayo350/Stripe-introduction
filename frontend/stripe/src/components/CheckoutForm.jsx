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
  
  //? Version améliorée d'un rendu en fonction de l'existance d'une méthode de paiement : https://github.com/stripe/react-stripe-js/blob/9fe1a5473cd1125fcda4e01adb6d6242a9bae731/examples/hooks/1-Card-Detailed.js
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


