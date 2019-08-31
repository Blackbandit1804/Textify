const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');

module.exports = (app, db) =>
{
	app.post('/account/register',
		[
			check('username')
				.not().isEmpty()
				.isLength({ min: 5 })
				.trim()
				.escape(),
			check('password')
				.not().isEmpty()
				.isLength({ min: 8 }),
			check('password-retype')
				.not().isEmpty()
				.isLength({ min: 8 })
				.custom((value, { req }) =>
				{
					if (value !== req.body.password)
					{
						// trow error if passwords do not match
						throw new Error('The given passwords don\'t match');
					}
					else
					{
						return value;
					}
				}),
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
				.then(exist =>
				{
					if(exist)
					{
						return res.status(400).json(
							{
								'Error':
								{
									'Code': 400,
									'Messages': [
										{
											'msg': 'The given username allready exists',
										},
									],
								},
							});
					}
					bcrypt.genSalt(parseInt(process.env.PASSWORD_SALT_ROUNDS), (err, salt) =>
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
						bcrypt.hash(req.body.password, salt, (err, hash) =>
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
							db.account.create(
								{
									username: req.body.username,
									password: hash,
								})
								.then(acc =>
								{
									acc.password = '**********';
									res.status(200).json(
										{
											'Success':
											{
												'Code': 200,
												'Data': acc,
											},
										});
								})
								.catch(err =>
								{
									res.status(500).json(
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
								});
						});
					});
				});
		}
	);
};