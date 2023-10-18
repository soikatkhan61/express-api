const SubCategory = require('../models/SubCategory');

const createSubCategory = async (req, res, next) => {
    const newSubCategory = new SubCategory(req.body);

    try {
        const savedSubCategory = await newSubCategory.save();
        res.status(200).json({ status: 201, message: "Subcategory created successfully" });
    } catch (err) {
        next(err);
    }
}

const updateSubCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({status: 200, message: "Subcategory updated successfully"});
    } catch (err) {
        next(err);
    }
}

const deleteSubCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        await SubCategory.findByIdAndDelete(id);
        res.status(200).json({status: 200, message: "Subcategory has been deleted!"});
    } catch (err) {
        next(err);
    }
}

const getSingleSubCategory = async (req,res ,next) => {
    const id = req.params.id;

    try {
        const subCategory = await SubCategory.findById(id);
        res.status(200).json(subCategory);
    } catch (err) {
        next(err);
    }
}

const getAllSubCategory = async (req, res, next) => {
    const qCategory = req.query?.category;
    const qNew = req.query?.new;

    try {
        let subCategories;

        if (qNew) {
            subCategories = await SubCategory.find().sort({createdAt: 1})
        } else if (qCategory) {
            subCategories = await SubCategory.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            subCategories = await SubCategory.find();
        }
        res.status(200).json(subCategories);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createSubCategory,
    deleteSubCategory,
    updateSubCategory,
    getSingleSubCategory,
    getAllSubCategory
}