var getUserInfoQuery = "SELECT id, username, phone_number, roles, vt,  profile, (EXTRACT(EPOCH FROM joined) * 1000)::int8 as joined, (EXTRACT(EPOCH FROM modified) * 1000)::int8 as modified FROM users WHERE id=$1";

var getUserInfo = module.exports = function(client, user_id, logger, callback) {

    client.query(getUserInfoQuery, [user_id], function(err, result) {

      if(err) {
        logger.error("Error occured when getting user info", err);
      }

      logger.debug('Got result', result.rows[0], 'from db');
      callback(result.rows[0]);

  });
}
