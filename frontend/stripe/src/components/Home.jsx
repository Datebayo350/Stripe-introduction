import {useEffect, useState} from "react";
import axios from "axios";
import {useStripe} from "@stripe/react-stripe-js"
import "./../App.css"

const Home = () => {
    
    const [productPrice, setProductPrice] = useState(0);
    
    const stripe = useStripe();
   
    async function createCheckoutSession (event) {
        try {

            //? Création de la session de paiement
            //? [On part du principe que l'on détient l'information nous permettant d'identifier le client] Récupération d'un client stripe enregistrés en particulier -> ici Constantin
            //? [On part du principe que l'on détient l'information nous permettant de savoir ce que souhaite acheter le client] Identifiant de l'objet price contenant la référence du produit souhaité -> ici l'abonnement premium FitLab
            
            const priceObject = await axios.post("http://localhost:5000/api/prices/retrieve",{
                data: {
                    priceId: "price_1Is2XMLG9PLRTQCEKWFclXzD",
                }
            });
            
            //? Si supérieur à 0 on set productPrice avec
            const priceObjectOfCustomerDesiredProduct = priceObject.data.result.unit_amount; //? actuellement null, car les prix d'abonnement en fonction du volume n'ont pas de prix exacte

            console.log("[FRONT] Object Prices",priceObject);

            const createdSession = await axios.post("http://localhost:5000/api/sessions/create",{
                data: {
                    productPriceObjectId : "price_1Is2XMLG9PLRTQCEKWFclXzD",
                    customerId: "cus_JV1ojMLjnnawm0",
                }
                
            });
    
            console.log("[FRONT] Session créée =>", createdSession);
            console.log("[FRONT] ID de session récupéré lors de l'instanciation de la méthode createCheckoutSesison", createdSession.data.sessionId);
            const sessionID = createdSession.data.sessionId;
            
            //?  Redirige vers un formulaire de paiement "Checkout" Stripe automatiquement 
            //? Formulaire de ce type là : https://stripe.com/docs/payments/checkout
            //? méthode redirectToCheckout: https://stripe.com/docs/js/checkout/redirect_to_checkout infos supplémentaires sur son fonctionnement: https://stripe.com/docs/payments/checkout/client#generate-checkout-button
            stripe
                .redirectToCheckout({sessionId: sessionID})
        }

        catch (e) {
            console.log("[FRONT] Error création de la sessions =>", e);
        }
    };

    useEffect(() => {
        
        createCheckoutSession();

    }, []);

    return (

        <div className="flex items-center flex-col h-80 mt-20 ">
            <h1 className=" max-h-12 max-w-xs font-bold text-white text-center text-3xl"> Home </h1>
            <button className=" button max-h-12 max-w-xs text-white p-4 font-bold rounded-lg shadow-xl  mt-40" > {productPrice > 0 ? `Payer ${productPrice} €`: 'Payer  mes produits'} </button>
        </div>
    )
}

export default Home;