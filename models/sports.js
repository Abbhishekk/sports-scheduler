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

      sports.belongsTo(models.user,{
        foreignKey: 'userId'  
      })

    }

    static createsports({sport,userId}){
      return this.create({
        sport_name: sport,
        userId: userId
      })
    }
    static getSports(userId){
      return this.findAll();
    }
    
    static async findSportByName(sportname,userId){
      const getSport= await this.findOne({
        where: {
          sport_name: sportname,
          userId: {
            [op.eq]: userId
        }
      }})
      console.log(getSport.length)
      return ((getSport.length == 0) ? true: false);
    }
    static findSportById(id, userId){
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