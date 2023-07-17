"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [
      {
        categoryName: "Bisnis",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        categoryName: "Ekonomi",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        categoryName: "Teknologi",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        categoryName: "Olahraga",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        categoryName: "Kuliner",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        categoryName: "Internasional",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        categoryName: "Fiksi",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
