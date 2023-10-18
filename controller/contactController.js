const Contact = require('../models/Contact');
const transporter = require('../config/nodemailer');
const createError = require('../utils/error');

const contactController = async (req, res, next) => {
    const {
        username, email, phone, message
    } = req.body;

    if (!username || !email || !phone || !message) {
        return next(createError(422, "Fill all the details"));
    }

    const newContact = new Contact(req.body);

    try {
        await newContact.save();

        const sendMsg = `
            <div>
                <span>Username: ${username}</span><br />
                <span>Email: ${email}</span><br />
                <span>Phone: ${phone}</span><br />
                <p>Message: ${message}</p>
            </div>
        `

        const mailOptions = {
            from: process.env.SENDER,
            to: process.env.RECEIVER,
            subject: 'Contact Details',
            html: sendMsg
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(201).send({ statusCode: 401, error });
            }
            console.log('Email sent: ' + info.response);
            res.status(201).send({ status: 201, message: "Contact send successfully" });
        });

    } catch (error) {
        next(err);
    }
}

const mailController = async (req, res, next) => {
    const {
        username, email, phone, message
    } = req.body;

    if (!username || !email || !message) {
        return next(createError(422, "Fill all the details"));
    }

    const sendMsg = `
        <div>
            <span>Username: ${username}</span><br />
            <span>Email: ${email}</span><br />
            <span>Phone: ${phone}</span><br />
            <p>Message: ${message}</p>
        </div>
    `

    const mailOptions = {
        from: process.env.SENDER,
        to: process.env.RECEIVER,
        subject: 'Join with you',
        html: sendMsg
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(201).send({ status: 401, error });
        }
        console.log('Email sent: ' + info.response);
        res.status(201).send({ status: 201, message: "Mail send successfully" });
    });
}

module.exports = { contactController, mailController };