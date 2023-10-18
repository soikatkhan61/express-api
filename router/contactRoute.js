const router = require('express').Router();
const {
    contactController, mailController
} = require('../controller/contactController');

const {verifyToken} = require('../middleware/authenticate');

router.post('/', verifyToken, contactController);

router.post('/mail', verifyToken, mailController);

module.exports = router;

