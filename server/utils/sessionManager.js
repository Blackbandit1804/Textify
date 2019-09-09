const Logger = require('../utils/logger');

class SessionManager
{
	/**
	 * Creates an instance of the session manager
	 * @param  {object} db Database handle
	 * @param  {string} token User-Token
	 */
	constructor(db, token)
	{
		this.db = db;
		this.token = token;
		this.sessionData = undefined;
	}
	/**
	 * Checks if the session exists
	 * @returns {boolean} Returns true if the session exists
	 */
	async checkSession()
	{
		try
		{
			this.sessionData = await this.db.sessions.findOne(
				{
					where:
					{
						token: this.token,
					},
				});
			if(!this.sessionData)
				return false;
			return true;
		}
		catch(err)
		{
			Logger.log(err, 'error');
			return false;
		}
	}

	/**
	 * Returns the id of the cuser
	 * @returns {number} User SQL AccountID
	 */
	async getSessionUserId()
	{
		try
		{
			const accountData = await this.db.sessions.findOne(
				{
					attributes: ['accountId'],
					where:
					{
						token: this.token,
					},
				});
			if(!accountData)
				return -1;
			return parseInt(accountData.dataValues.accountId);
		}
		catch (err)
		{
			Logger.log(err, 'error');
			return -1;
		}
	}

	/**
	 * Updates the user session
	 * @returns {boolean} Returns true if update was successfull
	 */
	async updateSession()
	{
		const validUntil = new Date(Date.now() + (30 * 60 * 1000));
		try
		{
			await this.sessionData.update(
				{
					validUntil: validUntil,
				});
			return true;
		}
		catch(err)
		{
			Logger.log(err, 'error');
			return false;
		}
	}
}

module.exports = SessionManager;