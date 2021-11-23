const ProductService = require('../services/ProductService');
const Util = require('../utilities/Util');

class ProductController{

    //[GET] /
    allProduct(req, res, next){
        ProductService.list(5, 1)
        .then(result=>{
            res.render('product/all-product', {
                product: result,
            });
        })
        .catch(err=>{
            console.log(err);
            next();
        })
        
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
        res.render('product/edit-product');
    }

    //[PUT] /add/course
    store(req, res, next){
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
        const productDetail = req.body["colors[]"].map((item, index)=>{
            return {
                proID: null,
                quantity: parseInt(req.body["quantity[]"][index]),
                color: item,
                size: req.body["sizes[]"][index],
                price: req.body["price[]"][index]
            }
        });
        const productImg = [{proID: null, proImage:null }]
        //ProductService.storeProduct(product, productDetail, productImg);

        res.redirect("/products");
    }

}

module.exports = new ProductController;