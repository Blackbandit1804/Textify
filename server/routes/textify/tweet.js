const { check, validationResult } = require('express-validator/check');
const SessionManager = require('../../utils/sessionManager');

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
		], async (req, res) =>
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
			const sessionManager = new SessionManager(db, req.body.token);
			if(await !sessionManager.checkSession())
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
			if(await !sessionManager.updateSession)
			{
				return res.status(500).json(
					{
						'Error':
						{
							'Code': 500,
							'Messages': [
								{
									'msg': 'Internal server error',
								},
							],
						},
					});
			}
			db.tweet.create(
				{
					text: req.body.message,
					accountId: sessionManager.getCurrentSessionObject().accountId,
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
	// #endregion

	// #region Show user tweets
	app.post('/u/:username?',
		[
			check('token')
				.not().isEmpty()
				.trim()
				.escape(),
		], async (req, res) =>
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
			const sessionManager = new SessionManager(db, req.body.token);
			if(await !sessionManager.checkSession())
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
			if(await !sessionManager.updateSession)
			{
				return res.status(500).json(
					{
						'Error':
						{
							'Code': 500,
							'Messages': [
								{
									'msg': 'Internal server error',
								},
							],
						},
					});
			}


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
							include: [
								{
									model: db.account,
									attributes: ['username', 'name', 'verified', 'avatarurl'],
								}],
							order:
							[
								[ 'id', 'DESC' ],
							],
							attributes: ['id', 'text', 'createdAt'],
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
	// #endregion

	// #region Show tweet
	app.post('/t/:tweetId?',
		[
			check('token')
				.not().isEmpty()
				.trim()
				.escape(),
		], async (req, res) =>
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
			const sessionManager = new SessionManager(db, req.body.token);
			if(await !sessionManager.checkSession())
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
			if(await !sessionManager.updateSession)
			{
				return res.status(500).json(
					{
						'Error':
						{
							'Code': 500,
							'Messages': [
								{
									'msg': 'Internal server error',
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
					include: [
						{
							model: db.account,
							attributes: ['username', 'name', 'verified', 'avatarurl'],
						}],
					attributes: ['text', 'createdAt'],
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
	// #endregion
};