const db = require("../models");
const Blog = db.Blog;
const User = db.User;
const Category = db.Category;
const Country = db.Country;
// const path = require("path");
// require("dotenv").config({
//   path: path.resolve(__dirname, "../.env"),
// });
// const SendEmail = require("../email/sendEmail");
// const fs = require("fs");
// const jwt = require("jsonwebtoken");

const BlogController = {
  createBlog: async (req, res) => {
    try {
      await db.sequelize.transaction(async (t) => {
        const { id } = req.user;
        const { data } = req.body;
        const blogData = JSON.parse(data);
        const blogImage = req.file.path;

        const result = await Blog.create(
          {
            userId: id,
            title: blogData.title,
            content: blogData.content,
            countryId: blogData.countryId,
            categoryId: blogData.categoryId,
            keywords: blogData.keywords,
            blogImg: blogImage,
          },
          { transaction: t }
        );

        return res.status(200).json({
          message: "Blog created",
          result,
        });
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Create Blog Failed",
        error: err.message,
      });
    }
  },

  getBlog: async (req, res) => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const pageSize = Number(req.query.size) || 10;
      const categoryId = req.query.id_cat;
      const sortBy = req.query.sort || "DESC";
      const offset = (pageNumber - 1) * pageSize;
      const whereCategory = categoryId ? { id: categoryId } : {};
      const data = await Blog.findAll({
        attributes: [
          "id",
          "title",
          "content",
          "keyword",
          "blogImg",
          "createdAt",
          "updatedAt",
        ],
        include: [
          {
            model: User,
            attributes: ["id", "username", "email", "phone"],
          },
          {
            model: Category,
            where: whereCategory,
            attributes: ["id", "categoryName"],
          },
          {
            model: Country,
            attributes: ["id", "countryName"],
          },
        ],
        // include: ["User", "Category", "Country"],
        limit: pageSize,
        offset,
        order: [["createdAt", sortBy]],
      });
      return res.status(200).json({
        message: "Get All Blog Succeed",
        data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        message: "Get Blog Failed",
        error: err.message,
      });
    }
  },
};

module.exports = BlogController;
