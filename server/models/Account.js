module.exports = (sequelize, DataTypes) =>
{
	const Account = sequelize.define('account',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			name: DataTypes.STRING,
			locked: DataTypes.BOOLEAN,
			verified: DataTypes.BOOLEAN,
			avatarurl: DataTypes.STRING,
		});
	Account.associate = (models) =>
	{
		Account.hasMany(models.tweet);
	};
	return Account;
};