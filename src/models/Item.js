const { Model, DataTypes } = require("sequelize");

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        position: DataTypes.INTEGER,
        domain_id: DataTypes.STRING,
        category_id: DataTypes.STRING,
        category_name: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        available: DataTypes.DECIMAL,
        sold: DataTypes.DECIMAL,
      },
      {
        sequelize,
      }
    );
  }
}

module.exports = Item;
