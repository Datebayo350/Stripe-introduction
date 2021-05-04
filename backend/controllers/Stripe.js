const SECRET_API_KEY = process.env.SECRET_API_KEY;
const stripe = require('stripe')(SECRET_API_KEY);

module.exports = {
    
    intents: {

        create: async (req, res, next) => {
            try {
                const paymentIntention = await stripe.paymentIntents
                .create({
                    customer:"cus_JQ9oPquYIz7zoN",
                    amount: 1500,
                    currency: "eur",
                    description:" Paiement en cours de réalisation",
                    receipt_email: "constantin@fitlab.fr",
                    metadata: {
                        order_id: "1234",
                    },
                })

                return res.json({ success: true, result: paymentIntention })
            }

            catch (error) {

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
                //! Moyen de paiement
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

    },
};
