const router = require('express').Router();
const {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProduct,
    getSingleProduct
} = require('../controller/productController');

const {verifyTokenAndAdmin} = require('../middleware/authenticate');


router.post('/',verifyTokenAndAdmin, createProduct);
router.put('/:id',verifyTokenAndAdmin, updateProduct);
router.delete('/:id',verifyTokenAndAdmin, deleteProduct);
router.get('/single/:id', getSingleProduct);
router.get('/all', getAllProduct);

module.exports = router;