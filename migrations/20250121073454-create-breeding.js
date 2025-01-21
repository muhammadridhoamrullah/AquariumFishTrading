"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Breedings", {
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
      startDate: {
        type: Sequelize.DATE,
      },
      expectedDate: {
        type: Sequelize.DATE,
      },
      success: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      offSpringCount: {
        type: Sequelize.INTEGER,
      },
      notes: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Breedings");
  },
};
