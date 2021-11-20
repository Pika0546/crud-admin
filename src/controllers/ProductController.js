const ProductService = require('../services/ProductService');

class ProductController{

    //[GET] /
    allProduct(req, res, next){
        res.render('product/all-product');
    }

    //[GET] /add
    addProduct(req, res, next){
        ProductService.insert();
        res.render('product/add-product');
    }

    //[GET] /view/:id
    viewProduct(req, res, next){
        res.render('product/view-product');
    }

    //[GET] /edit/:id
    editProduct(req, res, next){
        res.render('product/edit-product');
    }

    //[PUT] /add/course
    store(req, res, next){
        console.log(req.body);
        res.redirect('back');
    }

}

module.exports = new ProductController;