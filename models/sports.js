'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static createsports({sport}){
      return this.create({
        sport_name: sport
      })
    }
    static getSports(){
      return this.findAll();
    }
    static async findSportByName(sportname){
      const getSport= await this.findAll({
        where: {
          sport_name: sportname
        }
      })
      console.log(getSport.length)
      return ((getSport.length == 0) ? true: false);
    }
    static findSportById(id){
      return this.findByPk(id);
    }
  }
  sports.init({
    sport_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'sports',
  });
  return sports;
};