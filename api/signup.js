var insertUserQuery = 'INSERT INTO users (username, phone_number, gcm_token, device_type) SELECT CAST($1 AS VARCHAR), CAST($2 AS VARCHAR), CAST($3 AS TEXT), CAST($4 AS VARCHAR) WHERE NOT EXISTS (SELECT id FROM users WHERE phone_number=$2)';
var getTokenQuery = 'SELECT user_id, token FROM tokens WHERE user_id=(SELECT id FROM users WHERE phone_number=$1)';

var signupUser = module.exports = function(client, username, phone_number, gcm_token, device_type, logger, callback) {

  client.query(insertUserQuery, [username, phone_number, gcm_token, device_type], function(err, result) {

    if(err) {
      callback({ status: 'fail', detail: err });
    }

    logger.debug('Inserting user inside signup api ...');

    client.query(getTokenQuery, [phone_number], function(err, result) {

      if(err) {
        callback({ status: 'fail', detail: err });
      }

      logger.debug('Got token', result.rows[0], 'from db');
      callback(result.rows[0]);

    });

  });
}
