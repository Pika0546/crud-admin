const CategoryService = require('../services/CategoryService');
const Util = require('../utilities/Util');

const catePerPage = 5;
let currentPage = 1;
const maximumPagination = 5;
let totalPage = 1;
let totalCates;
class CategoryController{

     //[GET] /
     allCategory(req, res, next){
        //get page number
        const pageNumber = req.query.page;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        Promise.all([ CategoryService.list(catePerPage, currentPage),  CategoryService.totalCate()])
        .then(([cates, total])=>{
            totalCates = total;
            let paginationArray = [];
            totalPage = Math.ceil(totalCates/catePerPage);
            let pageDisplace = Math.min(totalPage - currentPage + 2, maximumPagination);
            if(currentPage === 1){
                pageDisplace -= 1;
            }
            for(let i = 0 ; i < pageDisplace; i++){
                if(currentPage === 1){
                    paginationArray.push({
                        page: currentPage + i,
                        isCurrent:  (currentPage + i)===currentPage
                    });
                }
                else{
                    paginationArray.push({
                        page: currentPage + i - 1,
                        isCurrent:  (currentPage + i - 1)===currentPage
                    });
                }
            }
            if(pageDisplace < 2){
                paginationArray=[];
            }

            res.render('category/all-category', {
                cates, 
                currentPage,
                paginationArray,
                prevPage: (currentPage > 1) ? currentPage - 1 : 1,
                nextPage: (currentPage < totalPage) ? currentPage + 1 : totalPage,
            });
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }

    //[POST] /store
    store(req, res, next){
        const category={
           catName: req.body.catName,
           catSlug: Util.getDataSlug(req.body.catName),
           quantity: 0,
           catImage: null
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
        
        CategoryService.totalCate()
        .then(total=>{
            CategoryService.store(total+1, category, req.files[0])
            .then((result)=>{
                return result;
            })
            .then((result)=>{
                res.status(200);
               
                if(totalCates%catePerPage === 0){
                    totalCates += 1;
                    totalPage = Math.ceil(totalCates/catePerPage);
                    currentPage+=1;
                }
                res.send('/categories?page=' + currentPage);
            })
            .catch((err)=>{
                console.log(err);
                res.status(400);
                res.render('404',{
                    layout: false,
                })
            })
        })
        .catch(err=>{
            console.log(err);
            res.render('404', {
                layout:false,
            })
        })
        
    }

    //[PUT] /edit/:id
    update(req, res, next){
        let cat = req.params.id;
        let catName = req.body.catName;

        let file;
        if(req.files){
            if(!req.files[0].mimetype.startsWith('image/')){
                res.status(415);
                res.render('404', {
                    layout:false,
                });
                return;
            }
            file = req.files[0];
        }
        else{
            file = null;
        }
        const category = {
            cat,
            catName,
            catSlug: Util.getDataSlug(catName)
        }
        CategoryService.update(category, file)
        .then((result)=>{
            return result;
        })
        .then((result)=>{
            if(file){
                res.send('/categories?page=' + currentPage);
            }
            else{
                res.redirect('/categories?page=' + currentPage);
            }
            
        })
        .catch(err=>{
            console.log(err)
            res.status(400);
            res.render('404', {
                layout:false,
            });
            return;
        })
    }

    //[DELETE] /delete/:id
    delete(req, res, next){
        const id = req.params.id;
        CategoryService.delete(id)
        .then((result)=>{
            totalCates -= 1;
            totalPage = Math.ceil(totalCates/catePerPage);
            res.redirect("back");
        })
        .catch((err)=>{
            console.log(err);
            next();
        })
    } 

}

module.exports = new CategoryController;