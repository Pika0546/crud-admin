const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detail', {
    detailID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    proID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'product',
        key: 'proID'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    size: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'detail',
    timestamps: false,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "detailID" },
          { name: "proID" },
        ]
      },
      {
        name: "fk_detail_Product",
        using: "BTREE",
        fields: [
          { name: "proID" },
        ]
      },
    ]
  });
};
