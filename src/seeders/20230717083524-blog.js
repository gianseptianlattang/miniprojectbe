"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Blogs", [
      {
        userId: 1,
        title: "testing",
        content: "testing data testing",
        categoryId: 1,
        keyword: "test",
        blogImg: "",
        countryId: 1,
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        userId: 2,
        title: "testing2",
        content: "testing2 data testing2",
        categoryId: 5,
        keyword: "test",
        blogImg: "",
        countryId: 1,
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Blogs", null, {});
  },
};
