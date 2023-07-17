module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
      keyword: {
        type: DataTypes.STRING,
      },
      blogImg: {
        type: DataTypes.STRING,
      },
      countryId: {
        type: DataTypes.INTEGER,
      },
    },
    {}
  );

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: "userId" });
    Blog.belongsTo(models.Country, { foreignKey: "countryId" });
    Blog.belongsTo(models.Category, { foreignKey: "categoryId" });
  };

  return Blog;
};
