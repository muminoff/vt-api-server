var updateProfileQuery = "UPDATE users SET profile=$1 WHERE id=$2";

var updateProfile = module.exports = function(client, profile, user_id, logger, callback) {

  client.query(updateProfileQuery, [profile, user_id], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
