const {models} = require('../models');
const Util = require('../utilities/Util');
const firebase = require('../firebase');
const {getStorage, ref, getDownloadURL } = require('firebase/storage');
class BrandService{
    list(limit, page){
        return models.brand.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
    }

    totalBrand(){
        return models.brand.count();
    }

    store(id, brand, file){
        const fileName = "brand" + id + "." + file.mimetype.split("/")[1];
        const blob = firebase.bucket.file(fileName);
        return new Promise((resolve, reject)=>{
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
                const myPro = [getDownloadURL(ref(storage, fileName)),  models.brand.findOne({where:{brandName: brand.brandName}})];
                Promise.all(myPro)
                .then(([url, result])=>{
                    brand.brandImage = url;
                    if(result){
                        brand.brandSlug += "-"+ id;
                    }
                    resolve(models.brand.create(brand));
                })
                .catch((error) => {
                    reject(error);
                });

            });
            
            blobWriter.end(file.buffer);
        });
    }
    update(brand, file){
        if(file){
            const fileName = "brand" + brand.brandID + "." + file.mimetype.split("/")[1];
            const blob = firebase.bucket.file(fileName);
            return new Promise((resolve, reject)=>{
                const blobWriter = blob.createWriteStream({
                    metadata: {
                        contentType: file.mimetype
                    }
                });
                
                blobWriter.on('error', (err) => {
                    console.log(err);
                    reject(err);
                });
                
                blobWriter.on('finish', () => {
                    const storage = getStorage();
                    const myPro = [getDownloadURL(ref(storage, fileName)),  models.brand.findOne({where:{brandName: brand.brandName}})];
                    Promise.all(myPro)
                    .then(([url, result])=>{
                        brand.brandImage = url;
                        if(result){
                            brand.brandSlug += "-"+ brand.id;
                        }
                        resolve( models.brand.update({
                            brandName: brand.brandName,
                            brandSlug: brand.brandSlug,
                            brandImage:url
                        },{
                            where: {
                                brandID: brand.brandID
                            }
                        }));
                    })
                    .catch((error) => {
                        reject(error);
                    });
                    // getDownloadURL(ref(storage, fileName))
                    // .then((url) => {
                    //     brand.brandImage = url;
                        
                    //     models.brand.update({
                    //         brandName: brand.brandName,
                    //         brandSlug: brand.brandSlug,
                    //         brandImage:url
                    //     },{
                    //         where: {
                    //             brandID: brand.brandID
                    //         }
                    //     }).then((result)=>{
                    //         resolve(result);
                    //     })
                    //     .catch((err)=>{
                    //         console.log(err);
                    //         reject(err);
                    //     })
                        
                    // })
                    // .catch((error) => {
                    //     console.log(error);
                    //     reject(error);
                    // });
                });
                
                blobWriter.end(file.buffer);
            });
           
        }
        else{
            return models.brand.update({
                brandName: brand.brandName,
                brandSlug:  brand.brandSlug,
            },{
                where: {
                    brandID: brand.brandID
                }
            })
        }
    }

    delete(brandID){
        return models.brand.destroy({
            where: {
                brandID: brandID
            }
        });
    }

    getTrash(limit, page){
        return models.brand.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
    }

    isSameName(brandName){
        return models.brand.findOne({
            where:{
                brandName: brandName
            }
        });
    }
}   

module.exports = new BrandService;