#Stripe Functionment
##WebHook : Listening
***The Stripe CLI allows to listen, trigger, and forward webhook events from the terminal.*** 

**Official doc :
    - [How to Listen WebHooks events](https://stripe.com/docs/stripe-cli/webhooks#predefined-endpoints)
    - [List of triggerable events from CLI available](https://github.com/stripe/stripe-cli/wiki/trigger-command#supported-events)
    - [Transform data received into JSON](https://stedolan.github.io/jq/tutorial/)**

**1) Install Stripe and his CLI tool**

We have several way to creat an product :
- From **Stripe Dashboard**, easy way nocode, accessible to everybody : **https://dashboard.stripe.com/test/products/create**
- From the source code using the object **Stripe Reference** : **https://stripe.com/docs/api**
- From **Stripe CLI** commands : **https://stripe.com/docs/stripe-cli**

**Stripe CLI** is it a bit more complicated we need firstly to install stripe in our project, so we'll se this way. Firstly install **stripe**
    
    npm install --save stripe

then for Linux users :
![Alt text](doc/linux.png?raw=true 'Title')
**https://github.com/stripe/stripe-cli/releases/latest**
and finish by adding the stripe command to your bin repository to access it everywhere in you shell.


**2) Start to listen stripe webhooks from CLI**

Log into your stripe account, run :

    stripe login

To start listening, run :
        
    stripe listen

From another shell trigger a fake event, run  : 

    stripe trigger event 
**[List of triggerable events from CLI available](https://github.com/stripe/stripe-cli/wiki/trigger-command#supported-events)**

Each time one action in link with **stripe** happend, **stripe** will emit an event. If we are in prod environment, we'll surrely want to receive the events informations into our server, to do so run :

    stripe listen --forward-to adress/of/the/page/on/your/server (example: localhost:3000/hooksInfos)

To filter the listening of specific events, run : 

    stripe listent --events payment_intent.created, etc... \
    --forward-to adress/of/the/page/on/your/server

With forwarding established, events that occur continue to show in the terminal, but we'll also see the response from our server.

 
