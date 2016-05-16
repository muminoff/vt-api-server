var updateProfileQuery = "UPDATE users SET profile=$2 WHERE id=$1";

var updateProfile = module.exports = function(client, user_id, avatar_url, logger, callback) {

  client.query(updateProfileQuery, [user_id, JSON.stringify({ avatar_url: avatar_url })], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
