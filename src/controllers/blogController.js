const { Op } = require("sequelize");
const db = require("../models");
const Blog = db.Blog;
const User = db.User;
const Category = db.Category;
const Country = db.Country;

const BlogController = {
  createBlog: async (req, res) => {
    try {
      if (!req.body.data || !req.file) {
        return res.status(400).json({
          error: "Create Blog Failed",
          message: "data or blogImage cannot be empty!",
        });
      }
      await db.sequelize.transaction(async (t) => {
        const { id } = req.user;
        const { data } = req.body;
        const { blogVideo } = req.body;
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
            blogVid: blogVideo,
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
        error: "Create Blog Failed",
        message: err.message,
      });
    }
  },

  getBlog: async (req, res) => {
    try {
      const pageNumber = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.size) || 10;
      const categoryId = req.query.id_cat;
      const sortBy = req.query.sort || "DESC";
      const offset = (pageNumber - 1) * pageSize;
      const searchTitle = req.query.searchByTitle;
      const whereTitle = searchTitle
        ? {
            title: {
              [Op.like]: `%${searchTitle}%`,
            },
          }
        : {};
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
        limit: pageSize,
        offset: offset,
        order: [["createdAt", sortBy]],
        where: whereTitle,
      });
      return res.status(200).json({
        message: "Get All Blog Succeed",
        pageNumber,
        pageSize,
        sortBy,
        categoryId,
        searchTitle,
        data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Get Blog Failed",
        message: err.message,
      });
    }
  },

  getBlogById: async (req, res) => {
    try {
      const blogId = parseInt(req.params.blogId);
      const data = await Blog.findOne({
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
            attributes: ["id", "categoryName"],
          },
          {
            model: Country,
            attributes: ["id", "countryName"],
          },
        ],
        where: { id: blogId },
      });
      return res.status(200).json({
        message: "Get Blog Succeed",
        data,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        error: "Get Blog Failed",
        message: err.message,
      });
    }
  },
};

module.exports = BlogController;
