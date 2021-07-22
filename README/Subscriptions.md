#Stripe Functionment
##Sucbscriptions : 
**Official doc : https://stripe.com/docs/billing/subscriptions/checkout**

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

**2) Create product and his price in CLI**

Run these commands in your shell :

    stripe products create \
    --name="Product Name" \
    --description="Product description"

If succeeded it wil prompt the **[product object](https://stripe.com/docs/api/products/object)** created. 

Then create a price object for this the product or another one already existing :

    stripe prices create \
    -d product=prod_JV2EPpQRXgMOyd \ <=  Id of the product wanted
    -d unit_amount=15000 \
    -d currency=eur \
    -d "recurring[interval]"=month

To specify a price based on a specific volume per example ***If you take a subscription for you and your 5 team mates, you'll pay less /month than if you was single*** see the **[Volume-based pricing](https://stripe.com/docs/billing/subscriptions/examples#pricing-tiers)** example, or the others billing examples **[here](https://stripe.com/docs/billing/subscriptions/examples)**;

If succeeded it will prompt the **[price object](https://stripe.com/docs/api/prices/object)** created.

**NOTE**:
*   ***This line specify the id of the product    wanted***
    - -d product=prod_JTAp7GWvPT450c \
*   ***The last line refer to the property "reccuring" (object) and his child property "interval" of the price object.***

*   ***In this case we created a price object who will be retrieved monthly, but if we want to create a price object for  one-time purchase we need to specify the [type property](https://stripe.com/docs/api/prices/object#price_object-type) value to "one_time"***

**3) Create checkout session**

 Create Stripe Checkout session **[Steps here](https://stripe.com/docs/billing/subscriptions/checkout#create-session)**

**4) Finally send the customer to the Stripe Checkout Form**
 
 Send customer to the  Stripe Checkout Form **[Steps here](https://stripe.com/docs/billing/subscriptions/checkout#add-redirect)**

**Markdown syntaxe: https://wprock.fr/blog/markdown-syntaxe/**

