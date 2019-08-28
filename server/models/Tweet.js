const Sequelize = require('sequelize');

class Tweet extends Sequelize.Model {}
Tweet.init(
	{
		userid: Sequelize.STRING,
		text: Sequelize.STRING,
	});