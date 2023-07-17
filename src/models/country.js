module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define(
    "Country",
    {
      countryName: {
        type: DataTypes.STRING,
      },
    },
    {}
  );

  Country.associate = (models) => {
    Country.hasMany(models.Blog, { foreignKey: "countryId" });
  };

  return Country;
};
