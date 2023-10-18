// external import
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('./config/dbConn');

// internal import 
const authRoute = require('./router/authRoute')
const userRoute = require('./router/userRoute')
const contactRoute = require('./router/contactRoute')
const productRoute = require('./router/productRoute')
const reviewRoute = require('./router/reviewRoute')
const orderRoute = require('./router/orderRoute')
const categoryRoute = require('./router/categoryRoute')
const subCategoryRoute = require('./router/subCategoryRoute')
const paymentRoute = require('./router/stripeRoute') 

const app = express()

// middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

// routes
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/contact", contactRoute)
app.use("/api/products", productRoute)
app.use("/api/reviews", reviewRoute)
app.use("/api/orders", orderRoute)
app.use("/api/categories", categoryRoute)
app.use("/api/subcategories", subCategoryRoute)
app.use("/api/checkout", paymentRoute)
0

// error handle
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});


module.exports = app;
