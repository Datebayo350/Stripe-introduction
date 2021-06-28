import { useStripe } from "@stripe/react-stripe-js"
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CustomCard from "./CustomCard"
import "./../App.css"

const Home = () => {

    const [productPrice, setProductPrice] = useState(0);
    //? Il faudra créer un système de récupération des informations du client une fois connecté, on le stockera ici
    const [customer, setCustomer] = useState('');
    const [susbscriptionSelected, setSubscriptionSelected] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [totalAmountToPay, setTotalAmountToPay] = useState(0);
    const [productQuantity, setProductQuantity] = useState('');
    const [euro, setEuro] = useState(0);
    const [customerPurchaseData, setCustomerPurchaseData] = useState([]);
    const [pricesData, setPricesData] = useState([]);

    const [premiumProductName, setPremiumProductName] = useState("");
    const [premiumProductId, setPremiumProductId] = useState("");
    const [premiumImage, setPremiumImage] = useState("");
    const [premiumCounter, setPremiumCounter] = useState(0);
    const [premiumPriceId, setPremiumPriceId] = useState("");

    const [silverProductName, setSilverProductName] = useState("");
    const [silverProductId, setSilverProductId] = useState("");
    const [silverImage, setSilverImage] = useState("");
    const [silverCounter, setSilverCounter] = useState(0);
    const [silverPriceId, setSilverPriceId] = useState("");
    
    const [disabled, setDisabled] = useState(false);
    const history = useHistory();
    const stripe = useStripe();

    useEffect(() => {

        //? Calcul du montant total à payer en fonction de l'abonnement choisi
        premiumCounter > 0 ? setTotalAmountToPay(premiumCounter * euro) : setTotalAmountToPay(silverCounter * euro);

        //? Récupération des informations produit (Nom, Prix, Image) nous permettant de construire les cards d'affichage
        const getProducts = async () => {

            //? Possibilité d'appeler api price.retrieveAll pour obtenir la liste des prix (tarif), et sortir le prix voulu, sinon récupération depuis le Dashboard
            setPremiumPriceId("price_1ItC4zLG9PLRTQCEN8TrdSEG");

            try {
                
                //? Liste des objets "Prices"
                //! ATTENTION : L'objet "Plans" est similaire à "Prices" cependant il n'est plus d'actualité, il faudra donc éviter de l'utiliser : https://stripe.com/docs/api/plans
                const prices = await axios.get("http://localhost:5000/api/prices/retrieveAll");
                
                //? Récupération de l'Objet "Prices" Premium, qui sera associé à l'objet "Products" Premium égallement => : https://stripe.com/docs/api/prices/object
                const premiumPrice = prices.data.result.data.find(premium => premium.nickname === "FitLab Premium - Abonnement dégréssif")
                const silverPrice = prices.data.result.data.find(premium => premium.nickname === "FitLab Silver - Abonnement Semestrielle")
                
                //? Liste des objets "Products"
                const products = await axios.get("http://localhost:5000/api/products/retrieveAll");
                const premiumProd = products.data.result.data.find(premium => premium.name === "Fitlab - Abonnement Premium (prix dégréssif)")
                const silverProd = products.data.result.data.find(premium => premium.name === "Fitlab - Abonnement Silver")

                const premiumPrcId = premiumPrice.id;
                const premiumProdImage = premiumProd.images
                const premiumProdName = premiumProd.name
                setPremiumPriceId(premiumPrcId)
                setPremiumImage(premiumProdImage);
                setPremiumProductName(premiumProdName);

                const silverPrcId = silverPrice.id;
                const silverProdImage = silverProd.images
                const silverProdName = silverProd.name
                setSilverPriceId(silverPrcId)
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

                //? On part du principe que l'on a récupéré les informations de l'objet silver
                const oneTimePurchase = {
                    product: "silver",
                    oneTime: {
                        price: 108
                    }
                };

                //? Méthode 1 : Préférer celle-là
                setPricesData([oneTimePurchase, subscriptionPurchasePrices]);

                //? Méthode 2
                // customerPurchaseData.push(subscription_purchase); 
                // setCustomerPurchaseData(subscription_purchase)

                // customerPurchaseData.push(oneTime_purchase); 
                // setCustomerPurchaseData(dataPrice)
            }

            catch (e) {
                console.log("Erreur useEffect =>", e);
            }
            
            //? Une fois qu'un produit a été associé à un prix ( et non l'inverse, la création d'un produit final se fait toujours dans ce sens ) on pourra le retrouver dans la liste des produits dans le dashboard : https://dashboard.stripe.com/test/products
            
            //? Exemple de creation d'un produit en ligne de commande  (Uniquement point 3): https://stripe.com/docs/billing/subscriptions/per-seat#create-business-model
        }
        getProducts();
    }, [euro])

    //? Calcule (particulièrement pour les abonnements par palier) le montant par abonnement 
    const calculatePricePerSubscription = _ => {
        if (premiumCounter !== 0) {

            //? On determine le prix par abonnement par palier en fonction de la quantitée choisie par le client

            if (premiumCounter >= 15) {
                setEuro(5);
            }
            else if (premiumCounter >= 6) {
                setEuro(10);

            } else {
                setEuro(15);
            }

        } else {

            //? Si premiumCounter = 0, cela voudra dire que le client s'est dirigé vers l'abonnement silver
            setEuro(108)
        }
    };

    //? Stock la quantité d'abonnements choisis
    const setCounterQuantity = (e) => {
        //? Chaîne de caractère contenant les valeurs des attributs du bouton cliqué
        const productName = e.target.outerHTML;
        //? On découpe la chaîne
        const arrayProductName = productName.split(" ");
        //? CLique sur le bouton plus ou sur le bouton moins ?
        const plusOUmoins = e.target.attributes.value.textContent;

        //? Determine le nom de l'abonnement : Premium ou Silver, qui permettra d'agir sur le counter associé
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
    };

    //? Stock le nom de l'abonnement choisi
    const selectedSubscription = (e) => {

        const subscriptionType = e.target.innerHTML;
        const decomposeSubscriptionName = subscriptionType.split(" ");
        const premiumORsilver = decomposeSubscriptionName[1];
        setDisabled(true);

        premiumORsilver === "Silver" ? setSubscriptionSelected("Silver") : setSubscriptionSelected("Premium");

        calculatePricePerSubscription();
    };

    //? Gère le comportement une fois que l'on click sur le bouton du montant totale à payer
    const handlePayThisPrice = (e) => {

        if (totalAmountToPay > 0) {
            if (selectedSubscription === "Premium") {

                //? Cet objet regroupe l'intégralité des données nous permettant de créer une objet "Subscription" voir doc : https://stripe.com/docs/api/subscriptions/create.
                //? La création de l'abonnement devra se faire au moment du paiement, si celui-ci n'échoue pas (on devra donc écouter les webhooks). 
                //? Cependant le formulaire de paiement ne se trouve pas sur cette page, deux possibilités sont envisageables : 
                //?     - 1) Transférer le formulaire de paiement sur cette page afin de pouvoir accéder aux informations de customerPurchaseData
                //?     - 2) Mettre en place un state pour l'application, afin de pouvoir accéder aux données depuis n'importe quelle page ( cette option sera retenue, Redux : https://redux.js.org/ ou les hook useReducer: https://fr.reactjs.org/docs/hooks-reference.html#usereducer ainsi que useContext: https://fr.reactjs.org/docs/hooks-reference.html#usecontext feront très bien l'affaire 
                
                setCustomerPurchaseData({ customer, premiumPriceId, productQuantity });
            } else {

                setCustomerPurchaseData({ customer, silverPriceId, productQuantity });

            }
            //? Redirection vers le formulaire de paiement
            history.push("/checkout-form")
        }
    }
    return (

        <>
            <div className="flex flex-col mt-3 items-center min-h-screen">
                <div className="container mt-10 p-14 mx-auto min-h-full flex justify-center">

                    {pricesData.length > 0 &&

                        <>
                            <CustomCard productName={premiumProductName} productImage={premiumImage} counter={premiumCounter} pricesData={pricesData[1]} disabled={disabled} onClickCounter={setCounterQuantity} onClickSubscription={selectedSubscription} />
                            
                            <CustomCard productName={silverProductName} productImage={silverImage} counter={silverCounter} pricesData={pricesData[0]} disabled={disabled} onClickCounter={setCounterQuantity} onClickSubscription={selectedSubscription} />
                        </>
                    }

                </div>
                <button onClick={handlePayThisPrice} className="button max-h-12 max-w-xs text-white p-4 font-bold rounded-lg shadow-xl -my-12" > {totalAmountToPay > 0 ? `Payer ${totalAmountToPay} €` : "Payer  mes produits"} </button> 
            </div>

        </>
    )

}

export default Home;