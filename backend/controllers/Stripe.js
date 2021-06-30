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

                const productObjects = await stripe.products.list({active: true});

                return res.json({ success: true, result: productObjects})
                
            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PRODUCT OBJECT =>", error);
                next(error);
            }

        
        }
    },

    taxRates:{
        
        create:null, //? Taxe TVA créée via la ligne de commande Stripe CLI : https://stripe.com/docs/api/tax_rates/object?lang=cli
        
        retrieveAll: async (req, res, next) => {
            
            try{
                const data = await stripe.taxRates.list();
                return res.json({taxexList: data});
            }
            catch(err){
                console.log(err);
                next(err);
            }
        },
    },

    sessions: {
        //? Méthode : https://stripe.com/docs/billing/subscriptions/checkout le paiement sera effectué via un formulaire Stripe généré automatiquement pas customisé.
        create: async (req, res, next) => {
            //? Récupération de l'identifiant de l'objet "Prices" du produit que le client a l'intention d'acheter, envoyé depuis le front lors de l'appel sur cette API
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
                const taxes = await stripe.taxRates.list({limit:1});
                const tva = taxes.data[0].id;

                const newSubscription = await stripe.subscriptions.create({
                    customer: req.body.data.customerId,
                    items: [
                        { price: req.body.data.items[0].price, quantity: req.body.data.items[0].quantity, tax_rates: [tva]}
                    ],
                    //? Autres attributs pouvant être intéréssants : 
                        //? - https://stripe.com/docs/api/subscriptions/create#create_subscription-default_payment_method
                        //? - https://stripe.com/docs/api/subscriptions/create#create_subscription-payment_behavior
                        //? - https://stripe.com/docs/api/subscriptions/create#create_subscription-add_invoice_items
                })

                return res.json({ success: true, createdSubscription: newSubscription })

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
    }, 
        
    webhook:  (req, res, next) => {

        //? Traitement des données reçues de Stripe dans la requête émise sur cette API
        //? L'Objet reçu sera un Event Object : https://stripe.com/docs/api/events
        const stripEventEmited = req.body;
        
        //? Traitement en fonction des différents événements que l'on souhaite écouter 
        //? #1 Liste complète des différents types d'événements pouvant être émis par Strip : https://stripe.com/docs/api/events/types 
        //? #2 Liste des événements avec possibilité de configurer des webhook également depuis le Dashboard : https://dashboard.stripe.com/test/webhooks
        
        switch (stripEventEmited.type) {
            case "invoice.payment_failed":
                //? Si le paiement échoue ou méthode de paiement invalide, notifier le client de l'échec et redemander à nouveau les info CB
                console.log("Votre paiement à échoué, veuillez rentrez à nouveau votre numéro de carte bancaire !");

            case "invoice.paid":
                //? On pourra s'appuyer sur cet événement pour : 
                //?    -   Gérer l'état de paiement sur l'autentification 3D
                //?    -   Gérer l'accès au contenu "abonnés" en stockant l'information en base de données
                console.log("Votre paiement à échoué, veuillez rentrez à nouveau votre numéro de carte bancaire !");


            case "checkout.session.async_payment_succeeded":
                console.log("Session de paiement finie, paiement validé !");

            case "payment_intent.succeeded":
                console.log("Intention de paiement confirmée, paiement validé !");
            
            case "customer.created":
                console.log("Creation de l'utilisateur réussie ! Mais écouter cet événement n'est pas utile, la réussite de cette action retourne déjà un objet Customer de manière synchrone");

            case "customer.subscription.created":
                //? Trouver comment obtenir la référence à l'objet parent globlae pour utiliser customers.retrieve, ce qui permettra d'obtenir le nom du client
                console.log(`Création de l'abonnement pour l'utilisateur ${stripEventEmited.data.object.id} réussie`);

        }

        res.sendStatus(200)
    }
    
};
