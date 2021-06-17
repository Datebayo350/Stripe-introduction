import { useEffect, useState } from "react";
import axios from "axios";
import { useStripe } from "@stripe/react-stripe-js"
import "./../App.css"

const Home = () => {

    const [productPrice, setProductPrice] = useState(0);
    const [customer, setCustomer] = useState('');
    const [susbscriptionSelected, setSubscriptionSelected] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [totalAmountToPay, setTotalAmountToPay] = useState(0);
    const [productQuantity, setProductQuantity] = useState('');
    const [euro, setEuro] = useState(0);
    const [customerPurchaseData, setCustomerPurchaseData] = useState([]);

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
    const stripe = useStripe();
    //? Possibilité d'appeler api price.retrieveAll pour obtenire la liste des prix (tarif), et sortir le prix voulu, sinon => Dashboard

    useEffect(() => {

        //? Calcul du montant total à payer en fonction de l'abonnement choisi
        premiumCounter > 0 ? setTotalAmountToPay(premiumCounter * euro) : setTotalAmountToPay(silverCounter * euro);

        //? Récupération des informations produit (Nom, Prix, Image) nous permettant de construire les cards d'affichage
        const getProducts = async () => {

            //? Possibilité d'appeler api price.retrieveAll pour obtenire la liste des prix (tarif), et sortir le prix voulu, sinon récupération depuis le Dashboard
            setPremiumPriceId("price_1ItC4zLG9PLRTQCEN8TrdSEG");

            try {
                const prices = await axios.get("http://localhost:5000/api/prices/retrieveAll");
                const premiumPrice = prices.data.result.data.find(premium => premium.nickname === "FitLab Premium - Abonnement dégréssif")
                const silverPrice = prices.data.result.data.find(premium => premium.nickname === "FitLab Silver - Abonnement Semestrielle")
                
                const products = await axios.get("http://localhost:5000/api/products/retrieveAll");
                const premiumProd = products.data.result.data.find( premium => premium.name === "Fitlab - Abonnement Premium (prix dégréssif)")
                const silverProd = products.data.result.data.find( premium => premium.name === "Fitlab - Abonnement Silver")
                
                const premiumPrcId = premiumPrice.data.result.id;
                const premiumProdImage = premiumProd.data.result.images
                const premiumProdName = premiumProd.data.result.name
                setPremiumPriceId(premiumPrcId)
                setPremiumImage(premiumProdImage);
                setPremiumProductName(premiumProdName);

                const silverPrcId = silverPrice.data.result.id;
                const silverProdImage = silverProd.data.result.images
                const silverProdName = silverProd.data.result.name
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

                //? On part du principe que l'on a récupéré
                const oneTimePurchase = {
                    product: "silver",
                    oneTime: {
                        price: 108
                    }
                };

                //? Méthode 1 : Préférer celle-là
                setCustomerPurchaseData([oneTimePurchase, subscriptionPurchasePrices]);

                //? Méthode 2
                // customerPurchaseData.push(subscription_purchase); 
                // setCustomerPurchaseData(subscription_purchase)

                // customerPurchaseData.push(oneTime_purchase); 
                // setCustomerPurchaseData(dataPrice)
            }

            catch (e) {
                console.log("Erreur useEffect =>", e);
            }

        }
        getProducts();
    }, [euro])

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
    }

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

    return (

        <div className="flex items-center flex-col h-80 mt-20 ">
            <h1 className=" max-h-12 max-w-xs font-bold text-white text-center text-3xl"> Home </h1>
            <button className=" button max-h-12 max-w-xs text-white p-4 font-bold rounded-lg shadow-xl  mt-40" > {productPrice > 0 ? `Payer ${productPrice} €` : `Payer  mes produits`} </button>
        </div>
    )
}

export default Home;