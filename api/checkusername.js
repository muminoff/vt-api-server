var checkUsernameQuery = 'select exists(select id from users where username=lower($1));';

var checkUsername = module.exports = function(client, username, logger, callback) {

    client.query(checkUsernameQuery, [username], function(err, result) {

      if(err) {
        logger.error("Error occured when checking username", err);
      }

      logger.debug('Got result', result.rows[0], 'from db');
      callback(result.rows[0]);

  });
}
