import {
    SET_DISABLED,
    RECORD_SUBSCRIPTION_SELECTED,
    RECORD_EURO_PER_SEAT,
    RECORD_TOTAL_AMOUNT_TO_PAY,
    RECORD_PRODUCT_QUANTITY,
    INCREMENT_PREMIUM_COUNTER,
    DECREMENT_PREMIUM_COUNTER,
    INCREMENT_SILVER_COUNTER,
    DECREMENT_SILVER_COUNTER,
    RECORD_PRODUCTS,
    RECORD_PRODUCTS_DATA,
    RECORD_PRICES,
    RECORD_PRICES_DATA,
}
    from "./../__actions__"

import { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { appContext } from "./../__contexts__";
import CustomCard from "./CustomCard"
import "./../App.css"

const Home = () => {
    const history = useHistory();
    const globalContext = useContext(appContext);
    const {state, dispatch} = globalContext;

    useEffect(() => {
        //? Calcul du montant total à payer en fonction de l'abonnement choisi
        state.premiumProductCounter > 0 ? dispatch({ type: RECORD_TOTAL_AMOUNT_TO_PAY, payload: state.premiumProductCounter * state.euroPerSeat }) : dispatch({ type: RECORD_TOTAL_AMOUNT_TO_PAY, payload: state.silverProductCounter * state.euroPerSeat });
        
        //? Récupération des informations produit (Nom, Prix, Image) nous permettant de construire les cards d'affichage
        const getProducts = async () => {

            try {

                //? Liste des objets "Products"
                const products = await axios.get("http://localhost:5000/api/products/retrieveAll");
                
                dispatch({type:RECORD_PRODUCTS, payload: products})
                
                const premiumProd = products.data.result.data.find(premium => premium.name === "Fitlab - Abonnement Premium (prix dégréssif)")
                const premiumProductName = premiumProd.name
                const premiumProductId = premiumProd.id
                const premiumProductImage = premiumProd.images
                
                const silverProd = products.data.result.data.find(premium => premium.name === "Fitlab - Abonnement Silver")
                const silverProductName = silverProd.name
                const silverProductId = silverProd.id
                const silverProductImage = silverProd.images
                
                dispatch({type:RECORD_PRODUCTS_DATA,payload:{
                    premium: {
                        premiumProductName,
                        premiumProductId,
                        premiumProductImage
                    },
                    silver: {
                        silverProductName,
                        silverProductId,
                        silverProductImage
                    }
                }})

                
                //? Liste des objets "Prices"
                //! ATTENTION : L'objet "Plans" est similaire à "Prices" cependent il n'est plus d'actualité, il faudra donc éviter de l'utiliser : https://stripe.com/docs/api/plans
                const prices = await axios.get("http://localhost:5000/api/prices/retrieveAll");
                dispatch({type:RECORD_PRICES, payload: prices})

                //? Récupération de l'Objet "Prices" Premium, qui sera associé à l'objet "Products" Premium égallement => : https://stripe.com/docs/api/prices/object
                const premiumPrice = prices.data.result.data.find(premium => premium.nickname === "FitLab Premium - Abonnement dégréssif")
                const silverPrice = prices.data.result.data.find(premium => premium.nickname === "FitLab Silver - Abonnement Semestrielle")

                const premiumProductPrice = {
                    product: "premium",
                    subscription: [
                        {
                            start: 1,
                            endTo: 5,
                            price: 15

                        },

                        {
                            start: 6,
                            endTo: 15,
                            price: 10

                        },

                        {
                            start: 16,
                            endTo: " +",
                            price: 5
                        }
                    ]
                }

                const silverProductPrice = {
                    product: "silver",
                    oneTime: {
                        price: 108
                    }
                };

                dispatch({type:RECORD_PRICES_DATA, payload:{
                    premium: {premiumPrice, premiumProductPrice},
                    silver: {silverPrice, silverProductPrice}
                }})
            }

            catch (e) {
                console.log("Erreur dans getProducts() =>", e);
            }

            //? Une fois qu'un produit a été associé à un prix ( et non l'inverse, la création d'un produit final se fait toujours dans ce sens ) on pourra le retrouver dans la liste des produits dans le dashboard : https://dashboard.stripe.com/test/products
            //? Exemple de creation d'un produit en ligne de commande  (Uniquement point 3): https://stripe.com/docs/billing/subscriptions/per-seat#create-business-model
        }
        getProducts();
    },[state.euroPerSeat])

    // //? Calcule (particulièrement pour les abonnements par palier) le montant par abonnement 
    const calculatePricePerSubscription = _ => {
    //TODO : Gérer le fait de cibler la quantité uniquement de l'abonnement selectionné, si j'incrémente le counter premuim ainsi que le silver et que je fini par choisir le silver, on rentrera dans la 1ère condition => Pas voulu
        if (state.premiumProductCounter !== 0 && state.silverProductCounter === 0) {
            if (state.premiumProductCounter >= 15) {
                //? Au click sur le bouton "choisir abonnement", on le désactive pour ne pas pouvoir continuer 
                dispatch({ type: SET_DISABLED});
                dispatch({ type: RECORD_EURO_PER_SEAT, payload: 5 });
                dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.premiumProductCounter });
            }
            else if (state.premiumProductCounter >= 6) {
                dispatch({ type: SET_DISABLED});
                dispatch({ type: RECORD_EURO_PER_SEAT, payload: 10 });
                dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.premiumProductCounter });
            } else {
                dispatch({ type: SET_DISABLED});
                dispatch({ type: RECORD_EURO_PER_SEAT, payload: 15 });
                dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.premiumProductCounter });
            }
        } else if (state.silverProductCounter !==0 && state.premiumProductCounter === 0 ) {
            dispatch({ type: SET_DISABLED});
            dispatch({ type: RECORD_EURO_PER_SEAT, payload: 108 })
            dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.silverProductCounter });

        } else {
            console.log("Les deux counteur ont une valeur, il faut que celui qui n'est pas le choix finale soit à 0");
        }
    };

    //? Stock la quantité d'unités d'abonnement choisi via les counter
    const setCounterQuantity = (e) => {
        //? Chaîne de caractère contenant les valeurs des attributs du bouton sur lequel j'ai cliqué
        const productName = e.target.outerHTML;
        //? On découpe la chaîne
        const arrayProductName = productName.split(" ");
        //? CLique sur le bouton plus ou sur le bouton moins ?
        const plusOUmoins = e.target.attributes.value.textContent;
        //? Récupération du nom de l'abonnement : Premium ou Silver, qui me permettra d'agir sur le counter silver ou premium

        if (arrayProductName[4] === "Premium") {
            if (plusOUmoins === "plus") {

                if (state.premiumProductCounter >= 0) {
                    dispatch({ type: INCREMENT_PREMIUM_COUNTER });
                }

            } else {
                if (state.premiumProductCounter >= 1) { dispatch({ type: DECREMENT_PREMIUM_COUNTER }) }
            }

        } else {
            if (plusOUmoins === "plus") {

                if (state.silverProductCounter >= 0) { dispatch({ type: INCREMENT_SILVER_COUNTER }) }

            } else {

                if (state.silverProductCounter >= 1) { dispatch({ type: DECREMENT_SILVER_COUNTER }) }
            }
        }
    };

    //? Stock le nom de l'abonnement choisi 
    const selectedSubscription = (e) => {

        const subscriptionType = e.target.innerHTML;
        const decomposeSubscriptionName = subscriptionType.split(" ");
        const premiumORsilver = decomposeSubscriptionName[1];
        premiumORsilver === "Silver" && state.silverProductCounter > 0 ? dispatch({ type: RECORD_SUBSCRIPTION_SELECTED, payload: { subscription: "Silver", objectPriceId: state.silverPriceId, productQuantity: state.silverProductCounter } }) : dispatch({ type: RECORD_SUBSCRIPTION_SELECTED, payload: { subscription: "Premium", objectPriceId: state.premiumPriceId, productQuantity: state.premiumProductCounter } })

        calculatePricePerSubscription();
    };

    //? Gère le comportement une fois que l'on click sur le bouton du montant totale à payer
    const handlePayThisPrice = _=> {
        if (state.totalAmountToPay > 0 && state.disabled) {
            history.push("/checkout-form")
        }else{
            console.log("Il faut choisir un abonnement");
        }
    }
    

    return (
        <>
            <div className="flex flex-col mt-3 items-center min-h-screen">
                <div className="container mt-10 p-14 mx-auto min-h-full flex justify-center">

                    {state.pricesData.length > 0 &&

                        <>
                            <CustomCard productName={state.premiumProductName} productImage={state.premiumProductImage} counter={state.premiumProductCounter} priceData={state.pricesData[0]} disabled={state.disabled} onClickCounter={setCounterQuantity} onClickSubscription={selectedSubscription} />

                            <CustomCard productName={state.silverProductName} productImage={state.silverProductImage} counter={state.silverProductCounter} priceData={state.pricesData[1]} disabled={state.disabled} onClickCounter={setCounterQuantity} onClickSubscription={selectedSubscription} />
                        </>
                    }

                </div>
                <button onClick={handlePayThisPrice} className="button max-h-12 max-w-xs text-white p-4 font-bold rounded-lg shadow-xl -my-12" > {state.totalAmountToPay > 0 ? `Payer ${state.totalAmountToPay} €` : "Payer  mes produits"} </button>
            </div>

        </>
    )

}

export default Home;