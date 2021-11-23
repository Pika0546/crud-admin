const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/ProductController');

router.get('/view/:id', ProductController.viewProduct);
router.get('/edit/:id', ProductController.editProduct);
router.get('/bin', ProductController.trash);
router.post('/store', ProductController.store);
router.get('/add', ProductController.addProduct);
router.get('/', ProductController.allProduct);

module.exports = router;
