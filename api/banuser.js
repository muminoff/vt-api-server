var banUserQuery = "UPDATE users SET roles=$2 WHERE id=$1";

var banUser = module.exports = function(client, user_id, logger, callback) {

  client.query(banUserQuery, [user_id, JSON.stringify({ banned: true })], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
