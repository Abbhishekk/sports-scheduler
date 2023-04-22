'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sport.init({
    sportcreated: DataTypes.BOOLEAN,
    sportname: DataTypes.STRING,
    session: DataTypes.BOOLEAN,
    date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    address: DataTypes.TEXT,
    noplayers: DataTypes.INTEGER,
    playernames: DataTypes.ARRAY
  }, {
    sequelize,
    modelName: 'sport',
  });
  return sport;
};