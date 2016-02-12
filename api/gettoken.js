var updateGCMTokenAndReturnDataQuery = "UPDATE users SET gcm_token=$2 WHERE phone_number=btrim($1, ' ') RETURNING id, username, (SELECT token FROM tokens WHERE user_id=(SELECT id FROM users WHERE phone_number=btrim($1, ' '))) as token";
// var getTokenQuery = 'SELECT token FROM tokens WHERE user_id=(SELECT id FROM users WHERE phone_number=$1)';

var getToken = module.exports = function(client, phone_number, gcm_token, logger, callback) {

    client.query(updateGCMTokenAndReturnDataQuery, [phone_number, gcm_token], function(err, result) {

      if(err) {
        logger.error("Error occured when getting token", err);
      }

      logger.debug('Got result', result.rows[0], 'from db');
      callback(result.rows[0]);

  });
}
