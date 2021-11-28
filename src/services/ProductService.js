const {models, testConnect, sequelize} = require('../models');
const imagelink = require('../models/imagelink');
const firebase = require('../firebase');
const {getStorage, ref, getDownloadURL } = require('firebase/storage');
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
    
    list(limit, page){
        return models.product.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
    }

    storeProduct(product, productDetail, files){
        let returnValue = true;
        let productImages=[];
        models.product.create(product)
        .then((result)=>{
            const nDetail = productDetail.length;
            for(let i = 0 ; i < nDetail ; i++){
                productDetail[i].proID = result.proID;
            }
            const nImage = files.length;
            for(let i = 0 ; i < nImage ; i++){
                productImages.push({
                    proID:result.proID,
                    proImage: null,
                })
            }
            files.forEach((file, index) => {
                const fileName = "pro" + result.proID + "_" + index + "." +file.mimetype.split("/")[1];
                const blob = firebase.bucket.file(fileName);
                const blobWriter = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });
                
                blobWriter.on('error', (err) => {
                    console.log(err);
                });
                
                blobWriter.on('finish', () => {
                    const storage = getStorage();
                    getDownloadURL(ref(storage, fileName))
                    .then((url) => {
                        productImages[index].proImage = url;
                        models.imagelink.create(productImages[index]);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                });
                
                blobWriter.end(file.buffer);
            });
            models.detail.bulkCreate(productDetail)
            .then((result1)=>{
                console.log("Detail Success");
            })
            .catch((err1)=>{
                console.log("Detail fail");
                returnValue = false;
            });
        })
        .catch((err)=>{
            returnValue = false;
            console.log(err);
            console.log("product fail");
        });
        return returnValue;
    }
}

module.exports = new ProductService;