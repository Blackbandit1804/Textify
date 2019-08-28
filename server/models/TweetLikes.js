module.exports = (sequelize, DataTypes) =>
{
	const TweetLikes = sequelize.define('tweetlikes',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
		});
	TweetLikes.associate = (models) =>
	{
		TweetLikes.belongsTo(models.tweet);
	};

	return TweetLikes;
};