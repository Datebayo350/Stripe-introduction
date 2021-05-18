import {useEffect, useState} from "react";
import axios from "axios";
import {useStripe} from "@stripe/react-stripe-js"
import "./../App.css"

const Home = () => {
    
    const [productPrice, setProductPrice] = useState(0);
    
    const stripe = useStripe();
   
    async function createCheckoutSession () {
    }

    return (

        <div className="flex items-center flex-col h-80 mt-20 ">
            <h1 className=" max-h-12 max-w-xs font-bold text-white text-center text-3xl"> Home </h1>
            <button onClick={createCheckoutSession} className=" button max-h-12 max-w-xs text-white p-4 font-bold rounded-lg shadow-xl  mt-40" > {productPrice > 0 ? `Payer ${productPrice} €`: 'Payer  mes produits'} </button>
        </div>
    )
}

export default Home;