const stripe = require('stripe')(process.env.STRIPE_KEY);
const Product = require('../models/Product');

const payment = async (req, res, next) => {
    const { products, baseUrl } = req.body;

    // custom products info 
    const lineItems = await Promise.all(
        products.map(async product => {
            const singleProduct = await Product.findById(product.id);
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: singleProduct.title,
                    },
                    unit_amount: Math.round(singleProduct.price * 100)
                },
                quantity: product.quantity
            }
        })
    );

    try {
        // stripe session
        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${baseUrl}/success`,
            cancel_url: `${baseUrl}/cancel`,
            shipping_address_collection: { allowed_countries: ["US", "CA", "BD"] },
            payment_method_types: ["card"],
        });

        return res.status(200).send({ stripeSession: session });
    } catch (err) {
        next(err);
    }

}

module.exports = {payment};