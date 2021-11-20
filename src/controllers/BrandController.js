class BrandController{

    //[GET] /
    allBrand(req, res, next){
        res.render('brand/all-brand');
    }


}

module.exports = new BrandController;