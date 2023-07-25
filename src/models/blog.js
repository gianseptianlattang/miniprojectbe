module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      keyword: {
        type: DataTypes.STRING,
      },
      blogImg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      blogVid: {
        type: DataTypes.STRING,
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
