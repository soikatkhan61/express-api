const router = require("express").Router();

const {
    updateUser, deleteUser,
    getSingleUser, getAllUser,
    getUserStats
} = require("../controller/userController");

const {
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization
} = require('../middleware/authenticate');


router.put('/:id', verifyTokenAndAuthorization, updateUser);
router.delete('/:id', verifyTokenAndAuthorization, deleteUser);
router.get('/single/:id', getSingleUser);
router.get('/all', verifyTokenAndAdmin, getAllUser);
router.get('/stats', verifyTokenAndAdmin, getUserStats);


module.exports = router;
