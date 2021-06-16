import {
    INCREMENT_PREMIUM_COUNTER,
    DECREMENT_PREMIUM_COUNTER,
    INCREMENT_SILVER_COUNTER,
    DECREMENT_SILVER_COUNTER,
    SUBSCRIPTION_SELECTED,
    RECORD_EURO_PER_SEAT,
    RECORD_TOTAL_AMOUNT_TO_PAY,
    RECORD_PRODUCT_QUANTITY,
    RECORD_CUSTOMER_PURCHASE_DATA,
}
    from "./../__actions__/actions"
import { useEffect, useState, useContext } from "react";
import AppContext from './../__contexts__/AppContext.jsx';
import { useStripe } from "@stripe/react-stripe-js"
import { useHistory } from "react-router-dom"
import CustomCard from "./CustomCard"
import axios from "axios";
import "./../App.css"

const Home = () => {
    //? Id De
    const [customer, setCustomer] = useState("");

    //? Quel abonnement choisi ?
    const [subscriptionSelected, setSubscriptionSelected] = useState("");

    //? Une fois l'abonnement choisi on grise le bouton
    const [disabled, setDisabled] = useState(false);

    //? Combien d'unités d'abonnements choisis
    const [premiumCounter, setPremiumCounter] = useState(0);

    //? Combien d'unités d'abonnements choisis
    const [silverCounter, setSilverCounter] = useState(0);

    //? Sert à l'affichage dynamique du nom de l'abonnement dans la card
    const [premiumProductName, setPremiumProductName] = useState("");

    const [silverProductName, setSilverProductName] = useState("");

    //? Sert à l'affichage dynamique du prix de l'abonnement dans la card
    const [premiumPrice, setPremiumPrice] = useState("");

    const [silverPrice, setSilverPrice] = useState("");

    //? Sert à l'affichage dynamique de l'image de l'abonnement dans la card
    const [premiumImage, setPremiumImage] = useState("");

    const [silverImage, setSilverImage] = useState("");

    //? Sert à l'affichage dynamique du montant finale à payer
    const [totalAmountToPay, setTotalAmountToPay] = useState(0)

    //? Montant en euro par pallier
    const [euro, setEuro] = useState(0)

    const [dataPrice, setDataPrice] = useState([])


    const stripe = useStripe();

    const globalContext = useContext(AppContext);
    const state = globalContext.state;
    const dispatch = globalContext.dispatch;

    const history = useHistory();



    //? Possibilité d'appeler api price.retrieveAll pour obtenire la liste des prix (tarif), et sortir le prix voulu, sinon => Dashboard
    const premiumPriceId = "price_1ItC4zLG9PLRTQCEN8TrdSEG";

    useEffect(() => {

        premiumCounter > 0 ? setTotalAmountToPay(premiumCounter * euro) : setTotalAmountToPay(silverCounter * euro);

        //! Calcul prix total - version Reducer  
        state.premiumCounter > 0 ? dispatch({ type: RECORD_TOTAL_AMOUNT_TO_PAY, payload: state.premiumCounter * state.euro }) : dispatch({ type: "RECORD_TOTAL_AMOUNT_TO_PAY", payload: state.silverCounter * state.euro });

        const getProducts = async () => {
            //? Possibilité d'appeler api price.retrieveAll pour obtenire la liste des prix (tarif), et sortir le prix voulu, sinon => Dashboard
            const premiumPriceId = "price_1ItC4zLG9PLRTQCEN8TrdSEG";
            try {
                const premiumProd = await axios.post("http://localhost:5000/api/products/retrieve", {
                    data: {
                        productId: "prod_JV2EPpQRXgMOyd"
                    }
                });
                //? Avec use reducer ça serait : dispatch({type: PREMIUM_PROD_FETCHED, payload: premiumProd}) etc ...
                //? Lors des dispatch on envoie les données qui seront stocké dans le state depuis le reducer, on ne stock pas ici  
                //? Et dans le reducer au niveau du case de cette action, on aura donc : return {...previousState, premiumImage: action.payload.data.result.image, premiumProductName: action.payload.data.result.name} , erreur de sntaxe possibles, mais dans l'ensemble ça ressemblera à  ca
                const premiumProdId = premiumProd.data.result.id;
                const premiumProdImage = premiumProd.data.result.images
                const premiumProdName = premiumProd.data.result.name
                setPremiumImage(premiumProdImage);
                setPremiumProductName(premiumProdName);

                const silverProd = await axios.post("http://localhost:5000/api/products/retrieve", {
                    data: {
                        productId: "prod_JTyCND5IoIerPm"
                    }
                })

                const silverProdId = silverProd.data.result.id;
                const silverProdImage = silverProd.data.result.images
                const silverProdName = silverProd.data.result.name

                setSilverImage(silverProdImage);
                setSilverProductName(silverProdName);

                const subscriptionPurchasePrices = {
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

                //? On part du principe que l'on a récupéré
                const oneTimePurchase = {
                    product: "silver",
                    oneTime: {
                        price: 108
                    }
                };

                //? Méthode 1 : Préférer celle-là
                setDataPrice([oneTimePurchase, subscriptionPurchasePrices]);

                //? Méthode 2
                // dataPrice.push(subscription_purchase); 
                // setDataPrice(subscription_purchase)

                // dataPrice.push(oneTime_purchase); 
                // setDataPrice(dataPrice)
            }
            catch (e) {
                console.log("Erreur useEffect =>", e);
            }

            //? 1) - Récupérer les informations manquantes depuis l'objet price et puis les stocker dans le state. -- OK
            //? 2) - Afficher les informations dans la card de manière dynamique en fonction des infos du state -- OK
            //? 3) - Création de l'abonnement en fonction de l'id du price ainsi que la quantité récupéré du state : https://stripe.com/docs/billing/subscriptions/per-seat#create-subscription .
            //? 4) - Au click sur payer "montant total du state" redirection checkout page.
            //? 5) - (Supprimer bouton "acheter" de la card je pense) Au click bouton "payer montant total" => transmission des informations  et création espace récapitulatif des produits pré-achetés sur la page checkout
            //? 6) - WebHook - Gestion des événements émis lors du paiement (subscription_created, invoice_paid etc) : https://stripe.com/docs/billing/subscriptions/per-seat#provision-access 

        }

        getProducts();

    }, [euro])

    const displayAmountToPay = _ => {
        if (premiumCounter !== 0) {
            if (premiumCounter >= 15) {
                setEuro(5);
                console.log("15 ou SUPP");

            }
            else if (premiumCounter >= 6) {
                setEuro(10);
                console.log("6 OU SUPP");

            } else {
                setEuro(15);
                console.log("5 OU MOINS");

            }
        } else {
            setEuro(108)
        }
        //! Calcul du montant euro par abonnement - version Reducer
        //TODO : Gérer le fait de cibler la quantité uniquement de l'abonnement selectionné, si j'incrémente le counter premmim ainsi que le silver et que je fini par choisir le silver, on rentrera dans la 1er condition => Pas voulu
        if (state.premiumCounter !== 0) {
            if (state.premiumCounter >= 15) {
                dispatch({ type: RECORD_EURO_PER_SEAT, payload: 5 });
                dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.premiumCounter });
                console.log("15 ou SUPP");

            }
            else if (state.premiumCounter >= 6) {
                dispatch({ type: RECORD_EURO_PER_SEAT, payload: 10 });
                dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.premiumCounter });

                console.log("6 OU SUPP");

            } else {
                dispatch({ type: RECORD_EURO_PER_SEAT, payload: 15 });
                dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.premiumCounter });

                console.log("5 OU MOINS");
            }
        } else {
            dispatch({ type: RECORD_EURO_PER_SEAT, payload: 108 })
            dispatch({ type: RECORD_PRODUCT_QUANTITY, payload: state.silverCounter });

        }
    }

    const handleOnClick = (e) => {
        //? Chaîne de caractère contenant les valeurs des attributs du bouton sur lequel j'ai cliqué
        const productName = e.target.outerHTML;
        //? On découpe la chaîne
        const arrayProductName = productName.split(" ");
        //? CLique sur le bouton plus ou sur le bouton moins ?
        const plusOUmoins = e.target.attributes.value.textContent;
        //? Récupération du nom de l'abonnement : Premium ou Silver, qui me permettra d'agir sur le counter silver ou premium
        console.log(plusOUmoins);

        if (arrayProductName[4] === "Premium") {
            if (plusOUmoins === "plus") {

                if (premiumCounter >= 0) { setPremiumCounter(premiumCounter + 1) }

            } else {
                if (premiumCounter >= 1) { setPremiumCounter(premiumCounter - 1) }
            }

        } else {
            console.log(silverCounter);
            if (plusOUmoins === "plus") {

                if (silverCounter >= 0) { setSilverCounter(silverCounter + 1) }

            } else {

                if (silverCounter >= 1) { setSilverCounter(silverCounter - 1) }
            }
        }

        //! Incrémentation des counter -- version Reducer 

        if (arrayProductName[4] === "Premium") {
            if (plusOUmoins === "plus") {

                if (state.premiumCounter >= 0) {
                    dispatch({ type: INCREMENT_PREMIUM_COUNTER });
                }

            } else {
                if (premiumCounter >= 1) { dispatch({ type: DECREMENT_PREMIUM_COUNTER }) }
            }

        } else {
            console.log(silverCounter);
            if (plusOUmoins === "plus") {

                if (silverCounter >= 0) { dispatch({ type: INCREMENT_SILVER_COUNTER }) }

            } else {

                if (silverCounter >= 1) { dispatch({ type: DECREMENT_SILVER_COUNTER }) }
            }
        }

    };

    //? Stock le nom de l'abonnement choisi
    const selectedSubscription = (e) => {

        const subscriptionType = e.target.innerHTML;
        const decomposerSubscriptionName = subscriptionType.split(" ");
        const premiumORsilver = decomposerSubscriptionName[1];
        setDisabled(true);

        premiumORsilver === "Silver" ? setSubscriptionSelected("Silver") : setSubscriptionSelected("Premium");

        //! Enregistrement du choix de l'abonnement- version Reducer
        premiumORsilver === "Silver" ? dispatch({ type: SUBSCRIPTION_SELECTED, payload: { subscription: "Silver", objectPriceId: state.silverPriceId } }) : dispatch({ type: "SUBSCRIPTION_SELECTED", payload: { subscription: "Premium", objectPriceId: state.premiumPriceId } })

        displayAmountToPay();
    }

    const handlePayThisPrice = (e) => {
        if (state.totalAmountToPay > 0) {
            if(state.subscriptionSelected === "Premium") {
                
                dispatch({ type: "RECORD_CUSTOMER_PURCHASE_DATA", payload: {priceObjectId: state.premiumPriceId} })
            }else {

                dispatch({ type: "RECORD_CUSTOMER_PURCHASE_DATA", payload: {priceObjectId: state.silverPriceId} })
            }
        }
        history.push("/checkout-form")
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <div className="container mt-10 p-8 mx-auto min-h-screen flex content-evenly">

                    {dataPrice.length > 0 &&

                        <>
                            <CustomCard productName={premiumProductName} productImage={premiumImage} counter={premiumCounter} dataPrice={dataPrice[1]} disabled={disabled} onClickCounter={handleOnClick} onClickSubscription={selectedSubscription} />
                            <CustomCard productName={silverProductName} productImage={silverImage} counter={silverCounter} dataPrice={dataPrice[0]} disabled={disabled} onClickCounter={handleOnClick} onClickSubscription={selectedSubscription} dispatch={dispatch} />
                        </>
                    }

                </div>
                <button onClick={handlePayThisPrice} className="button max-h-12 max-w-xs text-white p-4 font-bold rounded-lg shadow-xl -my-28" > {state.totalAmountToPay > 0 ? `Payer ${state.totalAmountToPay} €` : "Payer  mes produits"} </button>
            </div>

        </>
    )
}

export default Home;