const bcrypt = require("bcryptjs");
const User = require('../models/User');

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    // console.log("id: ", id);

    try {
        // if (req.body.password) {
        //     req.body.password = await bcrypt.hash(password, 10);
        // }

        const updatedUser = await User.findByIdAndUpdate(id,
            {
                $set: req.body
            },
            { new: true }
        );
        
        const { password, ...others } = updatedUser._doc;
        res.status(200).json({
            status: 200,
            message: "User updated successfully",
            user: others
        });
    } catch (err) {
        next(err);
    }
}

const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({status: 200, message: "User has been deleted!"});
    } catch (err) {
        next(err);
    }
}

const getSingleUser = async (req, res, next) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        next(err);
    }
}

const getAllUser = async (req, res, next) => {
    const query = req.query?.new;

    try {
        const users = query
            ? await User.find().sort({ createdAt: -1 })
            : await User.find().sort({ createdAt: -1 }).limit(5);
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

const getUserStats = async (req, res, next) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    updateUser,
    deleteUser,
    getUserStats,
    getAllUser,
    getSingleUser
};