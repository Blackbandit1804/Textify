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
						const validUntil = new Date(Date.now() + (30 * 60 * 1000) + (2 * 60 * 60 * 1000));
						db.sessions.findOrCreate(
							{
								where:
								{
									accountId: usr_acc.id,
								},
								defaults:
								{
									token: Math.random().toString(36).substring(7),
									validUntil: validUntil.toJSON().slice(0, 19).replace('T', ' '),
								},
							})
							.then(([sessionData, created]) =>
							{
								const tokenData = sessionData.get({
									plain: true,
								});
								tokenData.created = created;
								delete tokenData['updatedAt'];
								delete tokenData['accountId'];
								if(!created)
								{
									sessionData.update(
										{
											validUntil: validUntil,
										})
										.then(res.status(200).json(
											{
												'Success':
												{
													'Code': 200,
													'Data': tokenData,
												},
											}));
								}
								else
								{
									res.status(200).json(
										{
											'Success':
											{
												'Code': 200,
												'Data': tokenData,
											},
										});
								}
							});
					});
				});
		});
};