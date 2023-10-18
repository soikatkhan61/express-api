const bcrypt = require("bcryptjs");
const User = require('../models/User');
const { tokenGenerator } = require('../config/tokenGenerate');
const transporter = require('../config/nodemailer');
const createError  = require("../utils/error");


// register
const registerController = async (req, res, next) => {
    const { username, email, password, cpassword } = req.body;

    if (!username || !email || !password || !cpassword) {
        return next(createError(422, "Fill all the details" ));
    }

    try {
        const preuser = await User.findOne({ email: email });

        if (preuser) {
            return next(createError(404, "Already have an account!"));
        }

        if (password !== cpassword) {
            return next(createError(400, "Password doesn't match!"));
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username, 
            email,
            password: hashPassword,
            profilePic: req.body?.profilePic || ""
        });

        await newUser.save();

        res.status(201).json({
            status: 201,
            message: "User created successfully"
        });

    } catch (err) {
        next(err);
    }
}

// login
const loginController = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(createError(422, "Fill all the details" ));
    }

    try {
        const userValid = await User.findOne({ email: email });

        if (!userValid) {
            return next(createError(404, "User not found!"));
        }

        const isMatch = await bcrypt.compare(password, userValid.password);

        if (!isMatch) {
            return next(createError(400, "Wrong password or username!"));
        }

        // token generate
        const accessToken = tokenGenerator(userValid._id, "3d", userValid.isAdmin);

        const { password: pass, ...others } = userValid._doc;

        res.status(200).send({
            status: 200,
            message: "User loggedin successfully",
            user: others,
            token: accessToken
        });

    } catch (err) {
        next(err);
    }
}

// logout
const logoutController = (req, res) => {
    res.status(200).send({
        status: 200,
        message: "User has been logged out!",
    });
}

// send link through email for reset password
const sendPasswordLink = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(createError(422, "Fill all the details" ));
    }

    try {
        const userfind = await User.findOne({ email: email });

        // token generate for reset password
        const token = tokenGenerator(userfind._id, "300s");

        const setusertoken = await User.findByIdAndUpdate(
            { _id: userfind._id },
            { verifyToken: token },
            { new: true }
        );

        if (!setusertoken) {
            return next(createError(401, "You are not authenticated!"));
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Sending Email For Password Reset",
            text: `This Link Valid For 3 MINUTES http://localhost:5173/forgotpassword/${userfind._id}/${setusertoken.verifyToken}/`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return next(createError(401, "Email not sent!"));
            }

            console.log("Email sent", info.response);
            res.status(201).send({ status: 201, message: "Email sent Succsfully" })
        });

    } catch (err) {
        next(err);
    }
}

// verify user for forgot password time
const forgotPassword = async (req, res, next) => {
    const { id, token } = req.params;

    try {
        const validuser = await User.findOne({ _id: id, verifyToken: token });
        if (!validuser) {
            return next(createError(401, "User is not valid!" ));
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SEC);
        if (!verifyToken.id) {
            return next(createError(401, "You are not authenticated!"));
        }

        res.status(201).send({ status: 201, message: "User varified" })

    } catch (err) {
        next(err);
    }
}

// change password
const changePassword = async (req, res, next) => {
    const { id, token } = req.params;
    const { password, cpassword } = req.body;

    try {
        const validuser = await User.findOne({ _id: id, verifyToken: token });
        if (!validuser) {
            return next(createError(401, "User is not valid!" ));
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SEC);
        if (!verifyToken.id) {
            return next(createError(401, "You are not authenticated!"));
        }

        if (password !== cpassword) {
            return next(createError(422, "Password not match" ));
        }

        const newPassword = await bcrypt.hash(password, 10);
        const setNewPassword = await User.findByIdAndUpdate(
            { _id: id },
            { password: newPassword },
            { new: true }
        );

        await setNewPassword.save();

        res.status(201).json({
            status: 201,
            message: "Password change sucessfully"
        });

    } catch (err) {
        next(err);
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController,
    sendPasswordLink,
    forgotPassword,
    changePassword
};