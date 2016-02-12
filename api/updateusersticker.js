var updateStickerQuery = "UPDATE users SET vt=$1 WHERE id=$2";

var updateSticker = module.exports = function(client, vt, user_id, logger, callback) {

  client.query(updateStickerQuery, [vt, user_id], function(err, result) {

    if(err) {
      logger.error(err);
      return callback({ 'status': 'fail', 'detail': err });
    }

    return callback({ 'status': 'ok' });

  });

}
