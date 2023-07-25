"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Countries", [
      {
        countryName: "Indonesia",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        countryName: "Singapore",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        countryName: "Malaysia",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        countryName: "Thailand",
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Countries", null, {});
  },
};
