const { check, validationResult } = require('express-validator/check');

module.exports = (app, db) =>
{
	app.post('/tweet',
		[
			check('token')
				.not().isEmpty()
				.trim()
				.escape(),
			check('message')
				.not().isEmpty()
				.isLength({ min: 2 }),
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
			db.sessions.findOne(
				{
					where:
					{
						token: req.body.token,
					},
				})
				.then(sessionData =>
				{
					if(!sessionData)
					{
						return res.status(403).json(
							{
								'Error':
								{
									'Code': 403,
									'Messages': [
										{
											'msg': 'Incorrect token',
										},
									],
								},
							});
					}
					const validUntil = new Date(Date.now() + (30 * 60 * 1000) + (2 * 60 * 60 * 1000));
					sessionData.update(
						{
							validUntil: validUntil,
						})
						.then(() =>
						{
							db.tweet.create(
								{
									text: req.body.message,
									accountId: sessionData.accountId,
								})
								.then(tweet =>
								{
									delete tweet.dataValues['id'];
									delete tweet.dataValues['accountId'];
									delete tweet.dataValues['updatedAt'];
									res.status(200).json(
										{
											'Success':
											{
												'Code': 200,
												'Data': tweet,
											},
										});
								});
						});
				});
		});
};