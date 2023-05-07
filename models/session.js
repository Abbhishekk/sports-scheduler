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
      session.belongsTo(models.user,{
        foreignKey: 'userId'  
      })
    }

    static async addPlayer(id,player){
      const getSession = await this.findByPk(id);
      let playernames = getSession.playername
      playernames.push(player)
      console.log(playernames)
      return this.update({
        playername: playernames
      },{
        where: {
          id: id
        }
      })
    }

    static addSession({sportname, dateTime, address, players, noplayers, sessioncreated, userId}){
      return this.create({
        sportname: sportname,
        time: dateTime,
        userId: userId,
        address: address,
        playername: players,
        noplayers: noplayers,
        sessioncreated: sessioncreated
      })
    }

    static getSessions({sportname,userId}){
      return this.findAll({
        where: {
          sportname: sportname,
          sessioncreated: true,
          userId
        }
      })
    }
    static getAllSessions({sportname}){
      return this.findAll({
        where: {
          sportname: sportname,
          time: {
            [op.gt]: new date(),
          }
        }
      })
    }

    static async cancelSession(id,userId){
      
      //console.log(player,sessions.playername)
      return this.update({
        sessioncreated: false
      },{
        where: {
          userId: id
        }
      })
    }
    static getSessionById(id){
      return this.findByPk(id)
    }

    static async removePlayer(playername,id){
     
      const sessions = await session.findByPk(id);
      var index = sessions.playername.indexOf(playername)
      const player = sessions.playername.splice(index,1);
      //console.log(player,sessions.playername)
      return this.update({
        playername: sessions.playername
      },{
        where: {
          id: id
        }
      })
    }
  }
  session.init({
    sportname: DataTypes.STRING,
    time: DataTypes.DATE,
    address: DataTypes.STRING,
    playername: DataTypes.ARRAY(DataTypes.STRING),
    noplayers: DataTypes.INTEGER,
    sessioncreated: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'session',
  });
  return session;
};