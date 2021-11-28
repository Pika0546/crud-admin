const brand = require('../models/brand');
const BrandService = require('../services/BrandService');
const Util = require('../utilities/Util');

const brandPerPage = 5;
let currentPage = 1;
const maximumPagination = 5;
let totalPage = 1;
let totalBrands;
class BrandController{
    //[GET] /
    allBrand(req, res, next){
        //get page number
        const pageNumber = req.query.page;
        currentPage = (pageNumber && !Number.isNaN(pageNumber)) ? parseInt(pageNumber) : 1;
        currentPage = (currentPage > 0) ? currentPage : 1;
        currentPage = (currentPage <= totalPage) ? currentPage : totalPage
        Promise.all([ BrandService.list(brandPerPage, currentPage),  BrandService.totalBrand()])
        .then(([brands, total])=>{
            totalBrands = total;
            let paginationArray = [];
            totalPage = Math.ceil(totalBrands/brandPerPage);
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

            res.render('brand/all-brand', {
                brands, 
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
        const brand={
           brandName: req.body.brandName,
           brandSlug: Util.getDataSlug(req.body.brandName),
           quantity: 0,
           brandImage: null
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
        
        BrandService.totalBrand()
        .then(total=>{
            BrandService.store(total+1, brand, req.files[0])
            .then((result)=>{
                return result;
            })
            .then((result)=>{
                res.status(200);
               
                if(totalBrands%brandPerPage === 0){
                    totalBrands += 1;
                    totalPage = Math.ceil(totalBrands/brandPerPage);
                    currentPage+=1;
                }
                res.send('/brands?page=' + currentPage);
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
        let brandID = req.params.id;
        let brandName = req.body.brandName;

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
        const brand = {
            brandID,
            brandName,
            brandSlug: Util.getDataSlug(brandName)
        }
        BrandService.update(brand, file)
        .then((result)=>{
            return result;
        })
        .then((result)=>{
            if(file){
                res.send('/brands?page=' + currentPage);
            }
            else{
                res.redirect('/brands?page=' + currentPage);
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
        BrandService.delete(id)
        .then((result)=>{
            totalBrands -= 1;
            totalPage = Math.ceil(totalBrands/brandPerPage);
            res.redirect("back");
        })
        .catch((err)=>{
            console.log(err);
            next();
        })
    } 
}

module.exports = new BrandController;