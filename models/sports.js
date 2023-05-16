/* eslint-disable no-unused-vars */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      sports.belongsTo(models.user, {
        foreignKey: "userId",
      });
    }

    static createsports({ sport, userId }) {
      return this.create({
        sport_name: sport,
        userId: userId,
      });
    }
    static async deleteSport(id) {
      return await this.destroy({
        where: {
          id: id,
        },
      }).then(
        function (rowDeleted) {
          // rowDeleted will return number of rows deleted
          if (rowDeleted === 1) {
            console.log("Deleted successfully");
          }
        },
        function (err) {
          console.log(err);
        }
      );
    }
    static getSports(userId) {
      return this.findAll();
    }

    static async findSportByName(sportname, userId) {
      const getSport = await this.findOne({
        where: {
          sport_name: sportname,
          userId: userId,
        },
      });
      //console.log(getSport.length)
      if (getSport != null) {
        return getSport.length == 0 ? true : false;
      } else return getSport == null ? true : false;
    }
    static findSportById(id, userId) {
      return this.findByPk(id);
    }
    static getSportByUserId(userId) {
      return this.findAll({
        where: {
          userId: userId,
        },
      });
    }
  }
  sports.init(
    {
      sport_name: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "sports",
    }
  );
  return sports;
};
