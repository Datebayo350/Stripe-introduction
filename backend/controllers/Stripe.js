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
                .retrieve("pi_1InMyDLG9PLRTQCEFy6NLBaa");

                return res.json({ success: true, result: intentPaymentRetrieved })

            } catch (error) {
                next(error)
            }
        },

        update: async (req, res, next) => {
            
            try {
                console.log(req.body);
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
                const newCleverCustomer = new CustomerModel({
                    name: "Corsair",
                    phone: "0769235087",
                    email: "claudiu@fitlab.fr",
                    description: "Professionnel",
                    balance: 5000,
                })
                await newCleverCustomer.save();
                
                //? Création d'un utilisateur en base de données Stripe
                const newCustomer = await stripe.customers
                .create ({
                    name: "Claudiu",
                    phone: "+33 769875425",
                    email: "claudiu@fitlab.fr",
                    description: "Professionnel",
                })
                
                res.json({success: true, result: newCustomer})
            } 
            
            catch (error) {
                
                next(error)
            }
        },

        retrieve: async (req, res, next) => {
            try {
                
                const customer = await stripe.customers
                .retrieve("cus_JQG6G02ZZiFaml");
                
                res.json({success: true, result: customer})
                
            } 
            
            catch (error) {
                next(error);
            }
        },

        update: async (req, res, next) => {
            try {
                
                const editedCustomer = await stripe.customers
                .update("cus_JQG6G02ZZiFaml", 
                {
                    address: {
                        city: "Rennes",
                        country: "France",
                        state: "Bretagne",
                        postal_code: 35000,
                    },
                    balance: 15000,
                    description: "Professionnel du milieu sportif",
                });
                
                res.json({success: true, result: editedCustomer})
                
            } 
            
            catch (error) {
                next(error);
            }
        }
    }
};
