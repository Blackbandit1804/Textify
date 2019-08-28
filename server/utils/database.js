const Sequelize = require('sequelize');

module.exports = new Sequelize(process.env.DB_DB, process.env.DB_USER, process.env.DB_PASS,
	{
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		pool:
		{
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
		dialectOptions: {
			timezone: 'Etc/GMT+1',
		},
	});