const SECRET_STRIPE_API_KEY = process.env.SECRET_STRIPE_API_KEY;
//?  "stripe": "^8.145.0" => Nous permet d'accéder à l' API - Stripe Reference : https://stripe.com/docs/api
const stripe = require('stripe')(SECRET_STRIPE_API_KEY);
const CustomerModel = require('./../models/Customer');

module.exports = {

    intents: {

        create: async (req, res, next) => {
            //? On envoie une requête sur l'API - PaymentIntents (méthode create): https://stripe.com/docs/api/payment_intents?lang=node
            try {

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
                    .update("pi_1InN2sLG9PLRTQCEPh49EjxE", {
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
                        type: req.body.data.type,
                        card: req.body.data.card
                    });

                return res.json({ success: true, result: newPaymentMethod })

            }

            catch (error) {

                next(error);
            }
        },
        //? Afin de pouvoir modifier une méthode de paiement enregistrée, il faut l'attacher à un utilisateur : https://stripe.com/docs/api/payment_methods/attach?lang=node
        savePaymentMethodToAnUser: async (req, res, next) => {
            console.log("[BACK]Atache PM, data du front =>", req.body);
            try {
                //! Méthode de paiement (ex: CB), attachée à l'utilisateur ci-dessous
                const methodOfCustomer = await stripe.paymentMethods
                    .attach(
                        req.body.data.paymentMethodId, {
                        customer: req.body.data.customerId,
                    })

                console.log("[BACK] Carte attaché au client => ", methodOfCustomer);

                res.json({ succes: true, result: methodOfCustomer })
            }

            catch (error) {
                next(error);
            }


        },
        //? Permet de récupérer toutes les méthodes de paiement attachés UNIQUEMENT à un seul client
        retrieveAll: async (req, res, next) => {
            console.log("[BACK] Récupération MP's =>", req.body);
            try {
                const retrievedPaymentMethods = await stripe.paymentMethods
                    .list({ customer: req.body.data.customerId, type: req.body.data.paymentType });

                console.log("[BACK] Toutes les PM du client => ", retrievedPaymentMethods);

                res.json({ success: true, result: retrievedPaymentMethods })

            } catch (error) {

                next(error);
            }
        },

        retrieve: async (req, res, next) => {
            try {
                const retrieveMethod = await stripe.paymentMethods
                    .retrieve(
                        "pm_1InOqwLG9PLRTQCE76aBDsHr"
                    )

                res.json({ success: true, result: retrieveMethod })

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

                res.json({ success: true, result: updateMethod })
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
                    .create(req.body)

                res.json({ success: true, result: newCustomer })
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

                return res.json({ success: true, result: customerFinded })

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
                console.log("ERREUR EMISE PAR OBJET CUSTOMERS retrieveAll =>");
                next(error);
            }
        },

        update: async (req, res, next) => {
            try {

                const editedCustomer = await stripe.customers
                    .update(req.body.idCustomer, req.body.data);

                res.json({ success: true, result: editedCustomer })

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
                    .retrieve(price)

                return res.json({ success: true, result: pricesObject })

            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PRICES OBJECT =>", error);
                next(error);
            }


        },
        retrieveAll: async (req, res, next) => {

            try {
                const pricesObjects = await stripe.prices.list({ active: true })

                return res.json({ success: true, result: pricesObjects })

            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PRICES OBJECT =>", error);
                next(error);
            }


        },
        update: async (req, res, next) => {
            console.log(req.body.data);
            try {
                const updatedPriceObject = await stripe.prices
                    .update(
                        req.body.priceId,
                        req.body.data
                    )
                return res.json({ success: true, updatedPriceObject: updatedPriceObject })

            } catch (error) {
                console.log(error);
            }
        }
    },

    plans: {

        retrieveAll: async (req, res, next) => {

            try {
                const plansObjects = await stripe.plans.list({ active: true })

                return res.json({ success: true, result: plansObjects })

            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PLAN OBJECT =>", error);
                next(error);
            }


        },

        update: async (req, res, next) => {
            console.log("[PLANS] =>", req.body.data);
            try {
                const updatedPlanObject = await stripe.plans
                    .update(
                        req.body.planId,
                        req.body.data
                    )
                return res.json({ success: true, updatedPlanObject: updatedPlanObject })

            } catch (error) {
                console.log(error);
            }
        },

        delete: async (req, res, next) => {
            const deletedPlan = await stripe.plans
                .del(
                    req.body.data.planId
                );

            res.json({ success: true, deletedPlan: deletedPlan })
        }

    },

    products: {
        retrieveAll: async (req, res, next) => {

            try {

                const productObjects = await stripe.products.list({
                    active: true
                })

                return res.json({ success: true, result: productObjects })

            } catch (error) {
                console.log("ERREUR RENVOYEE PAR PRODUCT OBJECT =>", error);
                next(error);
            }


        },
        retrieve: async (req, res, next) => {

            try {
                const product = await stripe.products.retrieve(req.body.data.productId)

                return res.json({ success: true, result: product })
            }
            catch (error) {
                console.log("ERREUR RENVOYEE PAR PRODUCT OBJECT =>", error);
                next(error);
            }
        },

        delete: async (req, res, next) => {

            try {
                const deletedProduct = await stripe.products.delete(req.body.data.productId)

                return res.json({ success: true, result: deletedProduct })
            }
            catch (error) {
                console.log("ERREUR RENVOYEE PAR PRODUCT OBJECT =>", error);
                next(error);
            }
        }

    },

    invoices: {

        createDraftInvoice: async (req, res, next) => {
            console.log('DONNES POUR CREATION INVOICE =>', req.body.data);
            try {
                const createdInvoice = await stripe.invoices
                    .create({ customer: req.body.data.customerId })

                return res.json({ createdInvoice: createdInvoice, defaultAutoAdvance: createdInvoice.auto_advance })
            }
            catch (err) {
                console.log("ERREUR RENVOYEE PAR INVOICE OBJECT =>", err);
                next(err);
            }

        },

        retrieveAll: async (req, res, next) => {

            try {

                const invoices = await stripe.invoices
                    .list();

                return res.json({ success: true, result: invoices })

            } catch (error) {
                console.log("ERREUR RENVOYEE PAR INVOICE OBJECT =>", error);
                next(error);
            }


        },

        updateDraftInvoice: async (req, res, next) => {
            // !ici fonction update invoices, mais comment la récupérer ??
        
        },

        deleteDraftInvoice: async (req, res, next) => {

        },

        voidFinalizeInvoice: async (req, res, next) => {

        },

        payFinalizeInvoice: async (req, res, next) => {

        },

        finalizeDraftInvoice: async (req, res, next) => {

        },

        sendFinalizeInvoice: async (req, res, next) => {

        },

        
    },

    invoiceItems: {
        create: async (req, res, next) => {

        },
    },

    taxRates:{
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
            //? Récupération de l'identifiant de "l'objet Prices" du produit que le client a l'intention d'acheter, envoyé depuis le front lors de l'appel sur cette API
            const { customerId, productPriceObjectId } = req.body.data;

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
                            { price: productPriceObjectId, quantity: 16 }, //? Prix dégressif appliqué car achat de 5+ programmes
                            // {price: "price_1IqEyTLG9PLRTQCEomPMKKzD", quantity: 1}

                        ],
                        //? Propriété optionnelle
                        customer: customerId

                    })

                return res.json({ success: true, result: checkoutSession, sessionId: checkoutSession.id })

            } catch (error) {
                console.log("[BACK] Erreur émise lors de l'appel sur l'api création Session =>", error.message);
                next(error);
            }
        },

        retrieveAll: async (req, res, next) => {

            try {
                const checkoutSessions = await stripe.checkout.sessions.list();

                return res.json({ succes: true, results: checkoutSessions })
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

                console.log(
                    "CECI EST LA TVA =>", tva,
                    // "CECI EST CUSTOMER ID DANS BODY.DATA =>", req.body.data.customerId,
                    // "CECI EST ITEMS DANS BODY.DATA =>", req.body.data.items,
                    // "CECI EST ID DE L'OBJET PRICE DANS BODY.DATA.ITEMS =>", req.body.data.items[0].price,
                    // "CECI EST LA QUANTITE VOULU DE CET OBJET DANS DANS BODY.DATA.ITEMS =>", req.body.data.items[0].quantity,
                    );
                const newSubscription = await stripe.subscriptions.create({
                    customer: req.body.data.customerId,
                    items: [
                        { price: req.body.data.items[0].price, quantity: req.body.data.items[0].quantity, tax_rates: [tva]}
                    ],
                    // tax_rate: tva.data.id,
                    
                    // default_payment_method: req.body.data.paymentMethodId,
                    // payment_behavior: "default_incomplete"
                    // add_invoice_items:[{

                    // }]
                })

                // const invoiceCreatedId = newSubscription.latest_invoice;
                // const invoiceCreated = await stripe.invoices.retrieve(invoiceCreatedId)
                // console.log("FACTURE GENEREE QUI SERA MODIFIEE =>", invoiceCreated );

                // const updateGeneratedInvoice = await stripe.invoices.update()
                //! J'aimerais pouvoir utiliser invoices.update ici
                // console.log("OBJECT SUBSCRIPTION", newSubscription);

                return res.json({ success: true, createdSubscription: newSubscription })

            } catch (error) {
                console.log("ERREUR RENVOYEE PAR SUBSCRIPTIONS OBJECT =>", error);
            }
        },

        retrieveAll: async (req, res, next) => {

            try {
                const activeSubscriptionList = await stripe.subscriptions.list();

                return res.json({ success: true, subscriptionList: activeSubscriptionList })

            } catch (error) {
                console.log(error);
                next(error);
            }

        },


    },

    webhook: (req, res, next) => {

        //? Traitement des données reçues de Stripe dans la requête émise sur cette API
        //? L'Objet reçu sera un Event Object : https://stripe.com/docs/api/events
        const stripEventEmited = req.body;

        //? Traitement en fonction des différents événements que l'on souhaite écouter 
        //? #1 Liste complète des différents types d'événements pouvant être émis par Stripe : https://stripe.com/docs/api/events/types 
        //? #2 Liste des événements avec possibilité de configurer des webhook également depuis le Dashboard : https://dashboard.stripe.com/test/webhooks

        switch (stripEventEmited.type) {
            case "invoice.payment_failed":
                //? Si le paiement échoue ou méthode de paiement invalide, notifier le client de l'échec et redemander à nouveau les info CB
                console.log("Votre paiement à échoué, veuillez rentrez à nouveau votre numéro de carte bancaire !");

            case "invoice.paid":
                //? On pourra s'appuyer sur cet événement pour : 
                //?    -   Gérer l'état de paiement sur l'autentification 3D
                //?    -   Gérer l'accès au contenu "abonnés" en stockant l'information en base de données
                //?    -   Gérer l'envoie de la facture associé au client
                console.log("Votre paiement à échoué, veuillez rentrez à nouveau votre numéro de carte bancaire !");


            case "checkout.session.async_payment_succeeded":
                console.log("Session de paiement finie, paiement validé !");

            case "payment_intent.succeeded":
                console.log("Intention de paiement confirmée, paiement validé !");

            case "customer.created":
                console.log("Creation de l'utilisateur réussie ! Mais écouter cet événement n'est pas utile, la réussite de cette action retourne déjà un objet Customer de manière synchrone");

            //? Trouver comment obtenir la référence à l'objet parent global pour utiliser customers.retrieve, ce qui permettra d'obtenir le nom du client
            case "customer.subscription.created":
                console.log(`Création de l'abonnement pour l'utilisateur ${stripEventEmited.data.object.id} réussie`);

        }

        res.sendStatus(200)
    },

};
