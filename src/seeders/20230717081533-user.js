"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "test1",
        email: "test1@mailinator.com",
        phone: "0851111110",
        password:
          "$2b$10$aSsG1v5vHv/FKfY0jhpOjOrORXXr2rruZwa6X16EYqleY.ULLg7oe",
        profileImg: "",
        isVerified: 1,
        isActive: 1,
        isAdmin: 0,
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
      {
        username: "test2",
        email: "test2@mailinator.com",
        phone: "0851111110",
        password:
          "$2b$10$aSsG1v5vHv/FKfY0jhpOjOrORXXr2rruZwa6X16EYqleY.ULLg7oe",
        profileImg: "",
        isVerified: 1,
        isActive: 1,
        isAdmin: 0,
        createdAt: "2023-01-27 07:52:27",
        updatedAt: "2023-01-27 07:52:27",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
