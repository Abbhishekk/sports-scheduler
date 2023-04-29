'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sportname: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DATE
      },
      address: {
        type: Sequelize.STRING
      },
      playername: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      noplayers: {
        type: Sequelize.INTEGER
      },
      sessioncreated: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions');
  }
};