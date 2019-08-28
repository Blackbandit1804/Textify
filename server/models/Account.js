const Sequelize = require('sequelize');

class Account extends Sequelize.Model {}
Account.init(
	{
		username: Sequelize.STRING,
		password: Sequelize.STRING,
		name: Sequelize.STRING,
		locked: Sequelize.BOOLEAN,
	});