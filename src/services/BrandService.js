const {models} = require('../models');
const Util = require('../utilities/Util');

class BrandService{
    list(limit, page){
        return models.brand.findAll({offset: (page - 1)*limit, limit: limit, raw:true});
    }

    totalBrand(){
        return models.brand.count();
    }
}   

module.exports = new BrandService;