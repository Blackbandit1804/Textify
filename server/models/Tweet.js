module.exports = (sequelize, DataTypes) =>
{
	const Tweet = sequelize.define('tweet',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			text: DataTypes.STRING,
		});

	Tweet.associate = (models) =>
	{
		Tweet.hasMany(models.tweetlikes);
		Tweet.belongsTo(models.account);
	};
	return Tweet;
};