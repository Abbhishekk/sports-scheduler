"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     *  © Abhishek Bante
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.session, {
        foreignKey: "userId",
      });
      user.hasMany(models.sports, {
        foreignKey: "userId",
      });
    }
    static async getUser(userId) {
      return this.findByPk(userId);
    }

    static async AddsessionIdinuser(sessionId, userId) {
      const getUser = await this.getUser(userId);
      //console.log(getUser)
      getUser.sessionId.push(sessionId);
      return this.update(
        {
          sessionId: getUser.sessionId,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    }

    static async removeSessionId(sessionId, userId) {
      const getUser = await this.getUser(userId);
      getUser.sessionId.pop(sessionId);
      return this.update(
        {
          sessionId: getUser.sessionId,
        },
        {
          where: {
            id: userId,
          },
        }
      );
    }
  }
  user.init(
    {
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      sessionId: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
