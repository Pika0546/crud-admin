const {models, testConnect, sequelize} = require('../models');
const imagelink = require('../models/imagelink');

const Util = require('../utilities/Util');

class ProductService{

    findMaxID(product){
         models.product.max('proID')
        .then((result)=>{
            return result;
        })
        .catch((err)=>{
            console.log(err);
            return 0;
        })
    }

    countAllItem(){

    }

    insert(){
        
    }

    list(){
        
    }

    storeProduct(product, productDetail, productImages){
        let returnValue = true;
        models.product.create(product)
        .then((result)=>{
            const nDetail = productDetail.length;
            for(let i = 0 ; i < nDetail ; i++){
                productDetail[i].proID = result.proID;
            }
            const nImage = productImages.length;
            for(let i = 0 ; i < nImage ; i++){
                productImages[i].proID = result.proID;
                productImages[i].proImage = "/images/products/" + result.proID + ".png"
            }
            models.detail.bulkCreate(productDetail)
            .then((result1)=>{
                console.log("Detail Success");

            })
            .catch((err1)=>{
                console.log("Detail fail");
                returnValue = false;
            });

            models.imagelink.bulkCreate(productImages)
            .then(result2=>{
                console.log("Image Success");
            })
            .catch(err2=>{
                returnValue = false;
                console.log("image fail");
            });

        })
        .catch((err)=>{
            returnValue = false;
            console.log("product fail");
        });
        return returnValue;
    }
}

module.exports = new ProductService;