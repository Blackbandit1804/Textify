module.exports = (sequelize, DataTypes) =>
{
	const Sessions = sequelize.define('sessions',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			token: DataTypes.STRING,
			validUntil: DataTypes.DATE,
		});

	Sessions.associate = (models) =>
	{
		Sessions.belongsTo(models.account);
	};
	return Sessions;
};