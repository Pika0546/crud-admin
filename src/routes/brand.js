const express = require('express');
const router = express.Router();

const BrandController = require('../controllers/BrandController');

router.get('/', BrandController.allBrand);

module.exports = router;
