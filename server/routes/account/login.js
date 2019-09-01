const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

module.exports = (app, db) =>
{
	app.post('/account/login',
		[
			check('username')
				.not().isEmpty()
				.isLength({ min: 5 })
				.trim()
				.escape(),
			check('password')
				.not().isEmpty()
				.isLength({ min: 8 }),
		], (req, res) =>
		{
			const errors = validationResult(req);
			if(!errors.isEmpty())
			{
				return res.status(400).json(
					{
						'Error':
					{
						'Code': 400,
						'Messages': errors.array(),
					},
					});
			}
			db.account.findOne({ where: { username: req.body.username } })
				.then(usr_acc =>
				{
					if(!usr_acc)
					{
						return res.status(403).json(
							{
								'Error':
								{
									'Code': 403,
									'Messages': [
										{
											'msg': 'The given username does not exists',
										},
									],
								},
							});
					}
					bcrypt.compare(req.body.password, usr_acc.password, (err, match) =>
					{
						if(err)
						{
							return res.status(500).json(
								{
									'Error':
									{
										'Code': 500,
										'Messages': [
											{
												'msg': err.message,
											},
										],
									},
								});
						}
						if(!match)
						{
							return res.status(403).json(
								{
									'Error':
									{
										'Code': 403,
										'Messages': [
											{
												'msg': 'The given password is not correct',
											},
										],
									},
								});
						}
					});
				});
		});
};