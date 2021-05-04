const SECRET_API_KEY = process.env.SECRET_API_KEY;
const stripe = require('stripe')(SECRET_API_KEY);

module.exports = {
    
    intents: {

        create: async (req, res, next) => {
            try {
                const paymentIntention = await stripe.paymentIntents
                .create({
                    customer:"cus_JQ9oPquYIz7zoN",
                    amount: "20000",
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
                .retrieve("pi_1InN2sLG9PLRTQCEPh49EjxE");

                return res.json({ success: true, result: intentPaymentRetrieved })

            } catch (error) {
                next(error)
            }
        },

       
    },

    payments: {

    },
    customers: {

    },
};
