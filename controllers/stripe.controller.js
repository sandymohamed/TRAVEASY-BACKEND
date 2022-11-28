const stripe = require("stripe")("sk_test_51K7mmkKJ8avTH1mvb9RaLomHNaqp2RsVX4wWS4F8Co9ZbReAynvLGDccDzFglZRAKgwos9BE9Xj6ofhTWA3wxreq00PO34GeZ0")
const {v4: uuidv4} = require('uuid')

exports.getStripe = async (req, res, next) => {
   console.log("GET RESPONSE FROM RESEARCHER");
   res.json({
    message: 'It Works'
   })
}

exports.postStripe= async(req, res, next) => {
    console.log(req.body.token);
    const {token, amount} = req.body;
    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token
    }).then(customer => {
        stripe.charges.create({
            amount: amount *100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, {idempotencyKey})
    }).then(result => {
        res.status(200).json(result)
    }).catch(err => {
        console.log(err);
    })
}