var unbanUserQuery = "UPDATE users SET roles=null WHERE id=$1";

var unbanUser = module.exports = function(client, user_id, logger, callback) {

  client.query(unbanUserQuery, [user_id], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
