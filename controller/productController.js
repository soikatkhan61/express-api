const Product = require('../models/Product');

const createProduct = async (req, res, next) => {
    const newProduct = new Product(req.body);

    try {
        await newProduct.save();
        res.status(200).json({status: 201, message: "Product created successfully"});
    } catch (err) {
        next(err);
    }
}

const updateProduct = async (req, res, next) => {
    const id = req.params.id;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({status: 200, message: "Product updated successfully"});
    } catch (err) {
        next(err);
    }
}

const deleteProduct = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({status: 200, message: "Product has been deleted!"});
    } catch (err) {
        next(err);
    }
}

const getSingleProduct = async (req, res, next) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
}

const getAllProduct = async (req, res, next) => {
    let subCat = [];

    const qNew = req.query.new;
    const qType = req.query.type;
    const qCategory = req.query.category;
    const qSubCat = req.query.subCat;
    const qMaxPrice = req.query.maxPrice;
    const qSort = req.query.sort;

    if (qSubCat !== 'undefined') {
        if (typeof (qSubCat) === 'string') {
            subCat = [...subCat, qSubCat]
        } else if (typeof (qSubCat) === 'object') {
            subCat = [...subCat, ...qSubCat];
        }
    }

    // console.log("subCat: ", subCat);

    try {
        let products;

        if (qType) {
            products = await Product.find({ type: qType }).sort({ createdAt: -1 }).limit(6);
        }
        else if (qNew) {
            products = await Product.find().sort({ createdAt: -1 });
        }
        else {
            if (subCat.length > 0) {
                products = await Product.find({
                    categories: qCategory,
                    subCategories: { $in: subCat },
                    price: { $lte: qMaxPrice },
                }).sort({
                    price: qSort === "asc" ? 1 : -1
                });
            } else {
                products = await Product.find({
                    categories: qCategory,
                    price: { $lte: qMaxPrice },
                }).sort({
                    price: qSort === "asc" ? 1 : -1
                });
            }

            // products = await Product.find({
            //     categories: qCategory,
            //     ...(subCat.length > 0 && { subCategories: {$in: subCat} }),
            //     price: { $lte: qMaxPrice },
            // }).sort({
            //     price: qSort === "asc" ? 1 : -1
            // });
        }
        // console.log("products: ", products);
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProduct,
    getSingleProduct
}
