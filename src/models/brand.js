const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('brand', {
    brandID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    brandName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    brandSlug: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    brandImage: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'brand',
    timestamps: false,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "brandID" },
        ]
      },
    ]
  });
};
