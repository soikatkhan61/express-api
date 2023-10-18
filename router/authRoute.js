const router = require("express").Router();
const {
    registerController,
    loginController,
    logoutController,
    sendPasswordLink,
    forgotPassword,
    changePassword
} = require("../controller/authController");

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/logout', logoutController);

// forgot password
router.post('/sendpasswordlink', sendPasswordLink);
router.post('/forgotpassword/:id/:token', forgotPassword);
router.post('/changepassword/:id/:token', changePassword);

module.exports = router;
