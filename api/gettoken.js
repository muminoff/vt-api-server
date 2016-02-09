var getTokenQuery = 'SELECT token FROM tokens WHERE user_id=(SELECT id FROM users WHERE phone_number=$1)';

var getToken = module.exports = function(client, phone_number, logger, callback) {

    client.query(getTokenQuery, [phone_number], function(err, result) {

      if(err) {
        logger.error("Error occured when getting token", err);
      }

      logger.debug('Got result', result.rows[0], 'from db');
      callback(result.rows[0]);

  });
}
