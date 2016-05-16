var updateProfileQuery = "UPDATE users SET profile=$2 WHERE id=$2";

var updateProfile = module.exports = function(client, user_id, profile, logger, callback) {

  client.query(updateProfileQuery, [user_id, profile], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
