const router = require('express').Router();
const {
    createSubCategory,
    deleteSubCategory,
    updateSubCategory,
    getSingleSubCategory,
    getAllSubCategory
} = require('../controller/subCategoryController');

const {
verifyTokenAndAdmin
} = require('../middleware/authenticate');


router.post('/', verifyTokenAndAdmin, createSubCategory);
router.put('/:id', verifyTokenAndAdmin, updateSubCategory);
router.delete('/:id', verifyTokenAndAdmin, deleteSubCategory);
router.get('/single/:id', getSingleSubCategory);
router.get('/all', getAllSubCategory);


module.exports = router;