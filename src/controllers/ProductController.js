const ProductService = require('../services/ProductService');
const Util = require('../utilities/Util');
class ProductController{

    //[GET] /
    allProduct(req, res, next){
        res.render('product/all-product');
    }

    //[GET] /trash
    trash(req, res, next){
        res.render('product/trash-product');
    }

    //[GET] /add
    addProduct(req, res, next){
        //ProductService.insert();
        res.render('product/add-product');
    }

    //[GET] /view/:id
    viewProduct(req, res, next){
        res.render('product/view-product');
    }

    //[GET] /edit/:id
    editProduct(req, res, next){
        res.render('product/edit-product')
    }

    //[PUT] /add/product
    store(req, res, next){
        if(!req.files || req.files.length < 1){
            res.status(400);
            res.render('404', {
                layout:false,
            });
            return;
        }
        req.files.forEach(file => {
            if(!file.mimetype.startsWith('image/')){
                res.status(415);
                res.render('404', {
                    layout:false,
                });
                return;
            }else{
               
            }
        });
         const product = {
            proName: req.body.proName,
            proSlug:Util.getDataSlug(req.body.proName),
            description: req.body.proDes,
            fullDescription: req.body.description,
            quantity: 0,
            sold: 0,
            date: new Date(),
            catID: parseInt(req.body.proCate),
            brandID: parseInt(req.body.proBrand),
            sex: parseInt(req.body.proGender),
            isFeature: req.body.proFeature ? true : false,
        }

        const productDetail = req.body.colors.map((item, index)=>{
            return {
                proID: null,
                quantity: parseInt(req.body.quantity[index]),
                color: item,
                size: req.body.sizes[index],
                price: req.body.price[index]
            }
        });
        const fileImage = req.files;
        ProductService.storeProduct(product, productDetail, fileImage);
        res.send("/products");
    }

    //[PUT] /update/detail/:id
    updateDetail(req, res, next){

    }

    //[PUT] /update/image/:id
    updateImage(req, res, next){

    }

    //[PUT] /update/review/:id
    updateReview(req, res, next){

    }
}

module.exports = new ProductController;