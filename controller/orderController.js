const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res, next) => {
    const { order } = req.body;
    const newOrder = new Order(order);

    try {
        const createOrder = await newOrder.save();
        const { products } = createOrder;

        const productItems = await Promise.all(
            products.map(async product => {
                const id = product.productId;
                const singleProduct = await Product.findById(id);

                return await Product.findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            availableProduct: (singleProduct.availableProduct - product.quantity)
                        }
                    },
                    {new: true}
                );
            })
        );

        if(productItems) {
            res.status(201).json({
                sucess: true,
                message: 'Order created successfully'
            });
        }

        // update product availability
        // for (const product of products) {
        //     const findProduct = Product.findOne({_id: product.id});

        //     await Product.updateOne(
        //         { _id: product.id}, 
        //         { $set: { 
        //             availableProduct: (findProduct.availableProduct - product.quantity) } 
        //         },
        //         { new: true }
        //     );
        // }
    } catch (err) {
        next(err);
    }
}

const updateOrder = async (req, res, next) => {
    const id = req.params.id;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        next(err);
    }
}

const deleteOrder = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({status: 200, message: "Order has been deleted!"});
    } catch (err) {
        next(err);
    }
}

const findOrder = async (req, res, next) => {
    const orderId = req.params?.id;

    try {
        const order = await Order.findById(orderId);
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
}

const getSingleOrder = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const orders = await Order.find({ userId });
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

const getAllOrder = async (req, res, next) => {
    const query = req.query?.new;

    try {
        const orders = query
            ? await Order.find().sort({ createdAt: -1 })
            : await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
}

const getIncome = async (req, res, next) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth },
                    ...(productId && {
                        products: { $elemMatch: { productId } },
                    }),
                },
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        next(err);
    }
}


module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    findOrder,
    getSingleOrder,
    getAllOrder,
    getIncome
}