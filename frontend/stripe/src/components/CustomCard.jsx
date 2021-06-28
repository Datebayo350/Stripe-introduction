const CustomCard = (props) => {

    const { productName, productImage, counter, pricesData, disabled, onClickCounter, onClickSubscription, children } = props;
    console.log(pricesData);
    return (
        <div className="container card flex flex-col h-full mx-auto p-6 rounded-3xl shadow-2xl text-white font-bold lg:max-w-xl">
            <div className="container flex flex-col flex-wrap self-center mt-7 p-4 items-center">
                <h3 className="inline-block text-xl"> {productName} </h3>
                <div className="mt-7 w-56 max-w-64 h-56 max-h-64 rounded-xl">
                    <img className="w-max h-max" src={productImage} alt="abonnement premium" />
                </div>
            </div>

            <div className="container mt-7 h-48  flex flex-col items-center ">
                <p className="text-xl">Prix de l'abonnement par personne :</p>
                {pricesData.subscription
                    ?
                    <ul className="mt-3 min-h-full text-xl p-5">
                        {
                            pricesData.subscription.map((tier) =>
                                <li className="p-1" key={`Tier Price ${tier.start}`}>
                                    {tier.start} {typeof tier.endTo === 'number' ? "-": "et"} {tier.endTo} {typeof tier.endTo === 'number' ? "abonnements" : null} : <span> {tier.price} € / par abonnement </span>
                                </li>
                            )
                        }

                    </ul>
                    :
                    <ul className="mt-3 min-h-full text-xl p-5">
                        {
                            <li className="p-1" key={`Price ${pricesData.oneTime.price}`}>
                                {`${pricesData.oneTime.price} € / par abonnement tous les 6 mois`}
                            </li>

                        }

                    </ul>
                }
            </div>

            <div className="flex justify-center p-1">
              
                <p className="mt-4 text-xl">
               { pricesData.subscription ? "Premium x " : "Silver x " }
                 {counter}</p>
                <button name={productName} value="plus" disabled={disabled ? disabled : null} onClick={disabled ? null : onClickCounter}
                    className={disabled ? "disabled button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8" : "button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8"}>+</button>
    
            </div>

            <button onClick={onClickSubscription} disabled={disabled ? disabled : null} className={disabled ? "disabled self-center button max-h-12 w-4/5 text-white text-xl p-3 font-bold rounded-lg shadow-xl mt-10" : "self-center button max-h-12 w-4/5 text-white text-xl p-3 font-bold rounded-lg shadow-xl mt-10"}>
               { pricesData.subscription ? "Choisir Premium" : "Choisir Silver" }
            </button>

        </div>

    )
};


export default CustomCard;