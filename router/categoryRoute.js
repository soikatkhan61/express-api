const router = require('express').Router();
const {
    createCategory,
    deleteCategory,
    updateCategory,
    getSingleCategory,
    querySingleCategory,
    getAllCategory
} = require('../controller/categoryController');

const {
verifyTokenAndAdmin,
} = require('../middleware/authenticate');


router.post('/', verifyTokenAndAdmin, createCategory);
router.put('/:id', verifyTokenAndAdmin, updateCategory);
router.delete('/:id', verifyTokenAndAdmin, deleteCategory);
router.get('/single/:id', getSingleCategory);
router.get('/single', querySingleCategory);
router.get('/all', getAllCategory);


module.exports = router;