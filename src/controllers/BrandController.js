const brand = require('../models/brand');
const { totalBrand } = require('../services/BrandService');
const BrandService = require('../services/BrandService');
const Util = require('../utilities/Util');

const brandPerPage = 5;
let currentPage = 1;
const maximumPagination = 5;
let totalPage = 1;
class BrandController{
    //[GET] /
    allBrand(req, res, next){
        //get page number
        const pageNumber = req.query.page;
        currentPage = pageNumber ? pageNumber : 1;
        currentPage = currentPage > 0 ? currentPage : 1;
        currentPage = currentPage <= totalPage ? currentPage : totalPage

        Promise.all([ BrandService.list(brandPerPage, currentPage),  BrandService.totalBrand()])
        .then(([brands, total])=>{
            totalPage = total;
            let paginationArray = [];
            const sumPage = Math.floor(total/brandPerPage);
            const pageDisplace = Math.min(sumPage - currentPage, maximumPagination);
            for(let i = 0 ; i < pageDisplace; i++){
                if(currentPage == 1){
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
            res.render('brand/all-brand', {
                brands, 
                currentPage,
                paginationArray,
            });
        })
        .catch(err=>{
            console.log(err);
            next();
        })
    }


}

module.exports = new BrandController;