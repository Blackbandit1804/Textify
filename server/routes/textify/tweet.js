const { check, validationResult } = require('express-validator/check');

module.exports = (app, db) =>
{
	// #region Send tweet
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
	// #endregion

	// #region Show user tweets
	app.post('/u/:username?',
		[
			check('token')
				.not().isEmpty()
				.trim()
				.escape(),
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
							if(!req.params.username)
							{
								return res.status(400).json(
									{
										'Error':
									{
										'Code': 400,
										'Messages': [
											{
												'msg': 'Missing parameter username',
											},
										],
									},
									});
							}
							db.account.findOne(
								{
									where:
								{
									username: req.params.username,
								},
									attributes: ['id'],
								})
								.then(account =>
								{
									if(!account)
									{
										return res.status(400).json(
											{
												'Error':
											{
												'Code': 400,
												'Messages': [
													{
														'msg': 'Account not found',
													},
												],
											},
											});
									}
									db.tweet.findAll(
										{
											where:
											{
												accountId: account.id,
											},
											order:
											[
												[ 'id', 'DESC' ],
											],
										})
										.then(tweets =>
										{
											res.status(200).json(
												{
													'Success':
													{
														'Code': 200,
														'Data': tweets,
													},
												});
										});
								});
						});
				});
		});
	// #endregion

	// #region Show tweet
	app.post('/t/:tweetId?',
		[
			check('token')
				.not().isEmpty()
				.trim()
				.escape(),
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
							if(!req.params.tweetId || !parseInt(req.params.tweetId))
							{
								return res.status(400).json(
									{
										'Error':
									{
										'Code': 400,
										'Messages': [
											{
												'msg': 'Missing or wrong parameter tweetId',
											},
										],
									},
									});
							}
							db.tweet.findOne(
								{
									where:
									{
										id: req.params.tweetId,
									},
								})
								.then(tweetMessage =>
								{
									if(!tweetMessage)
									{
										return res.status(404).json(
											{
												'Error':
											{
												'Code': 404,
												'Messages': [
													{
														'msg': 'Tweet not found',
													},
												],
											},
											});
									}
									res.status(200).json(
										{
											'Success':
											{
												'Code': 200,
												'Data': tweetMessage,
											},
										});
								});
						});
				});
		});
	// #endregion
};