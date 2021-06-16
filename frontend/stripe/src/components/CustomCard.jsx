
const CustomCard = (props) => {

    const { productName, productImage, counter, dataPrice, disabled, onClickCounter, onClickSubscription, dispatch, children } = props;
    return (
        <div className="container card mx-3 rounded-3xl shadow-2xl text-white font-bold lg:max-w-xl lg:max-h-80 flex flex-col ">
            <div className="container flex flex-col mt-7 items-center">
                <h3 className="inline-block mx-auto text-xl"> {productName}  </h3>
                <img className="mt-7 w-2/4 rounded-xl" src={productImage} alt="abonnement premium" />
            </div>

            <div className="container mt-7 h-48  flex flex-col items-center ">
                <p className="text-2xl">Prix de l'abonnement par personne :</p>
                {dataPrice.subscription
                    ?
                    <ul className="mt-3 min-h-full text-xl p-5">
                        {
                            dataPrice.subscription.map((tier) =>
                                <li className="p-1" key={`Tier Price ${tier.start}`}>
                                    {tier.start} {typeof tier.endTo === 'number' ? "-": "et"} {tier.endTo} {typeof tier.endTo === 'number' ? "abonnements" : null} : <span> {tier.price} € / par abonnement </span>
                                </li>
                            )
                        }

                    </ul>
                    :
                    <ul className="mt-3 min-h-full text-xl p-5">
                        {
                            <li className="p-1" key={`Price ${dataPrice.oneTime.price}`}>
                                {`${dataPrice.oneTime.price} € / par abonnement tout les 6 mois`}
                            </li>

                        }

                    </ul>
                }
            </div>

            <div className="flex justify-center p-1">
                {/*<buton name={productName} value="moins" disabled={disabled ? disabled : null} onClick={disabled ? null : onClickCounter}
                    className={disabled ? "disabled button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8" : "button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8"}>-</buton>
                <p className="mt-4 text-xl">
                     
               { dataPrice.subscription ? "Premium x " : "Silver x " }
                 {counter}</p>
                <buton name={productName} value="plus" disabled={disabled ? disabled : null} onClick={disabled ? null : onClickCounter}
                    className={disabled ? "disabled button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8" : "button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8"}>+</buton> */}
                     
                <button name={productName} value="moins" disabled={disabled ? disabled : null} onClick={disabled ? null : onClickCounter}
                    className={disabled ? "disabled button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8" : "button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8"}>-</button>
                <p className="mt-4 text-xl">
               { dataPrice.subscription ? "Premium x " : "Silver x " }
                 {counter}</p>
                <button name={productName} value="plus" disabled={disabled ? disabled : null} onClick={disabled ? null : onClickCounter}
                    className={disabled ? "disabled button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8" : "button mt-4 w-1/5 m-2 rounded-md text-2xl text-center h-8"}>+</button>
    
            </div>

            <button onClick={onClickSubscription} disabled={disabled ? disabled : null} className={disabled ? "disabled self-center button max-h-12 w-4/5 text-white text-xl p-3 font-bold rounded-lg shadow-xl mt-10" : "self-center button max-h-12 w-4/5 text-white text-xl p-3 font-bold rounded-lg shadow-xl mt-10"}>
               { dataPrice.subscription ? "Choisir Premium" : "Choisir Silver" }
            </button>

        </div>

    )
};

export default CustomCard;