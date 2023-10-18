const router = require("express").Router();
const {payment} = require('../controller/stripeController');
const {verifyToken} = require('../middleware/authenticate');


router.post('/payment', verifyToken, payment);


module.exports = router;