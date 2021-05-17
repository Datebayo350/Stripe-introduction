const SECRET_STRIPE_API_KEY = process.env.SECRET_STRIPE_API_KEY;
//?  "stripe": "^8.145.0" => Nous permet d'accéder à l' API - Stripe Reference : https://stripe.com/docs/api
const stripe = require('stripe')(SECRET_STRIPE_API_KEY);
const CustomerModel = require('./../models/Customer');
module.exports = {
    
    intents: {

        create: async (req, res, next) => {
            try {

                //? On envoie une requête sur l'API - PaymentIntents (méthode créate): https://stripe.com/docs/api/payment_intents?lang=node
                const paymentIntention = await stripe.paymentIntents
                .create(req.body)
                const secret = paymentIntention.client_secret;
                
                return res.json({ success: true, result: paymentIntention, secret: secret })
            }

            catch (error) {
                console.log(error);
                next(error);
            }
            
        }, 
        
        retrieve: async (req, res, next) => {
            
            try {
                const intentPaymentRetrieved = await stripe.paymentIntents
                .retrieve(req.body.intentId);

                return res.json({ success: true, result: intentPaymentRetrieved })

            } catch (error) {
                next(error)
            }
        },

        update: async (req, res, next) => {
            
            try {
                const intentPaymentUpdated = await stripe.paymentIntents
                .update("pi_1InN2sLG9PLRTQCEPh49EjxE",{
                    amount: "8888"
                });


                return res.json({ success: true, result: intentPaymentUpdated })

            } catch (error) {
                next(error)
            }
        },
       
    },

    payments: {
        create: async (req, res, next) => {
            try {
                //! Moyen de paiement (ici carte bancaire)
                const newPaymentMethod = await stripe.paymentMethods
                .create({   
                    billing_details: {
                        email: "test@test.fr",
                        name: "Iskariot",
                        phone: "+33 858153874",
                    },
                    type: 'card',
                    card: {
                        number: "4242424242424242",
                        exp_month: 2,
                        exp_year: 2024,
                        cvc: "190"
                    },
                });
                
                return res.json({ success: true, result: newPaymentMethod})
        
            } 
            
            catch (error) {

                next(error);
            }
        },
        //? Afin de pouvoir modifier une méthode de paiement enregistrée, il faut l'attacher à un utilisateur : https://stripe.com/docs/api/payment_methods/attach?lang=node
        savePaymentMethodToAnUser: async (req, res, next) => {
            
            try {
                //! Méthode de paiement (ex: CB), attachée à l'utilisateur ci-dessous
                const methodOfCustomer = await stripe.paymentMethods
                .attach(
                "pm_1InPNtLG9PLRTQCELLuwFf96",{
                    customer: "cus_JPtuAnUxImrvSS",
                })

                res.json({succes: true, result: methodOfCustomer})
            } 
            
            catch (error) {
                next(error);
            }

            
        },
        retrieve: async (req, res, next) => {
            try {
                const retrieveMethod = await stripe.paymentMethods
                .retrieve(
                    "pm_1InOqwLG9PLRTQCE76aBDsHr"
                )

                res.json({success: true, result: retrieveMethod})

            } catch (error) {

                next(error);
            }
        },

        update: async (req, res, next) => {
            try {
                const updateMethod = await stripe.paymentMethods
                .update(
                    "pm_1InPNtLG9PLRTQCELLuwFf96", { 
                        billing_details: {
                            email: "zoldek@sama.fr",
                            name: "Iuda",
                            phone: "+33 0707070707",
                        },
                    }
                )
                
                res.json({success: true, result: updateMethod})
            } 
            
            catch (error) {
                
                next(error);
            }
        }
    },
    
    customers: {
        create: async (req, res, next) => {
            try {
                await CustomerModel.init();
                //? Création d'un utilisateur en base de données personnelle
                const newCleverCustomer = new CustomerModel(req.body)
                await newCleverCustomer.save();
                
                //? Création d'un utilisateur en base de données Stripe
                const newCustomer = await stripe.customers
                .create (req.body)
                
                res.json({success: true, result: newCustomer})
            } 
            
            catch (error) {
                
                next(error)
            }
        },

        retrieve: async (req, res, next) => {
            try {
                const customer = req.body.data.customerId;
                
                const customerFinded = await stripe.customers
                    .retrieve(customer);
                
                return res.json({success: true, result: customerFinded})
                
            } 
            
            catch (error) {
                next(error);
            }
        },

        retrieveAll: async (req, res, next) => {

            try {
                
                const customers = await stripe.customers.list();
                
                return res.json({ success: true, result: customers })
                
            } 
            
            catch (error) {
                next(error);
            }
        },

        update: async (req, res, next) => {
            try {
                
                const editedCustomer = await stripe.customers
                .update(req.body.idCustomer, req.body.data);
                
                res.json({success: true, result: editedCustomer})
                
            } 
            
            catch (error) {
                next(error);
            }
        }
    },
    
    prices: {
        retrieve: async (req, res, next) => {

            try {
                const price = req.body.data.priceId;

                const pricesObject = await stripe.prices
                    .retrieve("price_1Is2XMLG9PLRTQCEKWFclXzD")

                return res.json({ success: true, result: pricesObject})
                
            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PRICES OBJECT =>", error);
                next(error);
            }

        
        },
        retrieveAll: async (req, res, next) => {
        
            try {

                const pricesObjects = await stripe.prices.list()

                return res.json({ success: true, result: pricesObjects})
                
            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PRICES OBJECT =>", error);
                next(error);
            }

        
        }
    },
    
    products: {
        retrieveAll: async (req, res, next) => {
        
            try {

                const productObjects = await stripe.products.list()

                return res.json({ success: true, result: productObjects})
                
            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PRODUCT OBJECT =>", error);
                next(error);
            }

        
        }
    },
    
    sessions: {
        //? Méthode : https://stripe.com/docs/billing/subscriptions/checkout le paiement sera effectué via un formulaire Stripe généré automatiquement pas customisé.
        create: async (req, res, next) => {
            //? Récupération de l'identifiant de "l'objet Prices" du produit que le client a l'intention d'acheter, envoyé depuis le front lors de l'appel sur cette API
            const {customerId, productPriceObjectId} = req.body.data;

            try {
                //? La session doit être créée avant d'arriver sur la page du formulaire de paiement
                const checkoutSession = await stripe.checkout.sessions
                    .create({
                        //? Lors de la redirection en cas de succès du paiement, l'id de session du client est renvoyé dans l'url
                        //! Propriété requise
                        success_url: 'http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}',
                        //! Propriété requise
                        cancel_url: 'http://localhost:3000/payment-cancel',
                        //! Propriété requise
                        mode: 'subscription',
                        //! Propriété requise
                        payment_method_types: ['card'],
                        
                        //? Propriété optionnelle
                        //? Cette propriété fait référence à la liste d'articles que le client veut acheter : https://stripe.com/docs/api/checkout/sessions/create?lang=node#create_checkout_session-line_items
                        //? Ca peut tout aussi bien être des produits avec un paiement récurent (abonnements) que ponctuel (paiement une seul fois lors de l'achat)
                        //? Chaque produit est renseigné dans un tableau d'objet contenant deux propriétés : 
                        //?   -   L'identifiant de "l'objet Prices" du produit                    
                        //?   -   La quantité de ce produit souhaité par le client                    
                        line_items: [
                            
                            //? Lorsque le client arrive sur la page de paiement, on est censé récupérer l'identifiant de "l'objet Prices" du produit, et l'envoyer au back lors de l'arrivé du client sur cette page afin d'initialiser la session de paiement 
                            {price: productPriceObjectId, quantity: 16}, //? Prix dégressif appliqué car achat de 5+ programmes
                            // {price: "price_1IqEyTLG9PLRTQCEomPMKKzD", quantity: 1}
                        
                        ],
                        //? Propriété optionnelle
                        customer: customerId

                    })

                return res.json({ success: true, result: checkoutSession, sessionId: checkoutSession.id})
                
            } catch (error) {
                console.log("[BACK] Erreur émise lors de l'appel sur l'api création Session =>",error.message);
                next(error);
            }
        },

        retrieveAll: async (req, res, next) => {
            
            try {
                const checkoutSessions = await stripe.checkout.sessions.list();
        
                return res.json({succes: true, results: checkoutSessions})
            }

            catch (err) {
                console.log(err);
                next(err);
            }
            
        }


    },

    subscriptions: {
        create: async (req, res, next) => {
            try {
                
                const newSubscription = await stripe.subscriptions.create({

                }) 

            } catch (error) {
                console.log("ERREUR RENVOYEE PAR SUBSCRIPTIONS OBJECT =>", error);
            }    
        },

        retrieveAll: async (req, res, next) => {
            
            try {
                const activeSubscriptionList = await stripe.subscriptions.list();

                return res.json({ success: true, subscriptionList: activeSubscriptionList})
                    
            } catch (error) {
                console.log(error);
                next(error);
            }
        
        }
    }

};
