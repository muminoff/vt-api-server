var deleteMessageQuery = "DELETE FROM messages WHERE id=$1 AND $2 in (select id from users where (roles ->> 'admin') is not null)";

var messageDelete = module.exports = function(client, id, admin, logger, callback) {

  client.query(deleteMessageQuery, [id, admin], function(err, result) {

    if(err) {
      logger.error(err);
      callback({ status: 'fail', detail: err });
    }

    return callback({ status: 'ok' });

  });
}
