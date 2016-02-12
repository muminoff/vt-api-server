var updateUsernameQuery = "UPDATE users SET username=$2 WHERE id=$1";

var updateUsername = module.exports = function(client, user_id, username, logger, callback) {

  client.query(updateUsernameQuery, [user_id, username], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
