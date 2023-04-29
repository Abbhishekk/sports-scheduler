'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  session.init({
    sportname: DataTypes.STRING,
    time: DataTypes.DATE,
    address: DataTypes.STRING,
    playername: DataTypes.ARRAY,
    noplayers: DataTypes.INTEGER,
    sessioncreated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'session',
  });
  return session;
};