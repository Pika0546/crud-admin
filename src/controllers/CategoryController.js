class CategoryController{

    //[GET] /
    allCategory(req, res, next){
        res.render('category/all-category');
    }

}

module.exports = new CategoryController;