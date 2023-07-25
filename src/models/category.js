module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      categoryName: {
        type: DataTypes.STRING,
      },
    },
    {}
  );

  Category.associate = (models) => {
    Category.hasMany(models.Blog, { foreignKey: "categoryId" });
  };

  return Category;
};
