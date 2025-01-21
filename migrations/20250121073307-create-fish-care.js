"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FishCares", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      MyFishId: {
        type: Sequelize.INTEGER,
        references: {
          model: "MyFishes",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      temperature: {
        type: Sequelize.FLOAT,
      },
      pH: {
        type: Sequelize.FLOAT,
      },
      medication: {
        type: Sequelize.STRING,
      },
      feeding: {
        type: Sequelize.STRING,
      },
      behavior: {
        type: Sequelize.STRING,
      },
      checkUpDate: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FishCares");
  },
};
