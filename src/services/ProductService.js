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

    insert(product){

    }

    list(){
        
    }
}

module.exports = new ProductService;