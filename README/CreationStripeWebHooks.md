#Stripe Functionment
##WebHook : Creation
**Official doc :
    - What are [WebHooks ](https://stripe.com/docs/webhooks#what-are-webhooks) ?
    - Steps for ['TEST' the WebHook endpoint ](https://stripe.com/docs/webhooks/test)
    - [Object Events](https://stripe.com/docs/api/events), emited by Stripe Events
    - List of Stripe [Event Types](https://stripe.com/docs/api/events/types)
    - List of all [events emited](https://dashboard.stripe.com/test/events) on our Stripe account, available from the dashboard**

***Metaphorically, webhooks are like a phone number that Stripe calls to notify you of activity in your Stripe account. The activity could be the creation of a new customer or the payout of funds to your bank account. The webhook endpoint is the person answering that call who takes actions based upon the specific information it receives.***

Webhooks utilisation is specialy useful for the async events like : 
    - Subscriptions
    - Notifications of payouts
    - Utilisation of the Payment Intents API

When these events occur, is often after the main action conducting to them.
So being able to realise specific behavior in function of the type emited, in prod environement we need to creat an WebHook endpoint on our server who'll listening these events and execute the apropriated code then.
Some examples **[here](https://stripe.com/docs/webhooks#when-to-use-webhooks)**

