const Category = require('../models/Category');
const createError = require('../utils/error');

const createCategory = async (req, res, next) => {
    const newCategory = new Category(req.body);

    try {
        await newCategory.save();
        res.status(200).json({status: 201, message: "Category created successfully"});
    } catch (err) {
        next(err);
    }
}

const updateCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({status: 200, message: "Category updatded successfully"});
    } catch (err) {
        next(err);
    }
}

const deleteCategory = async (req, res, next) => {
    const id = req.params.id;
    try {
        await Category.findByIdAndDelete(id);
        res.status(200).json({status: 200, message: "Category has been deleted!"});
    } catch (err) {
        next(err);
    }
}

const getSingleCategory = async (req, res, next) => {
    const categoryId = req.params?.id;

    try {
        const category = await Category.findById(categoryId);
        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}

const querySingleCategory = async (req, res, next) => {
    const cat = req.query?.cat;

    try {
        const category = await Category.findOne({title: cat});
        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
}

const getAllCategory = async (req, res, next) => {
    const query = req.query?.new;
    try {
        const categories = query 
            ? await Category.find().sort({createdAt: 1})
            : await Category.find()
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createCategory,
    deleteCategory,
    updateCategory,
    getSingleCategory,
    querySingleCategory,
    getAllCategory
}