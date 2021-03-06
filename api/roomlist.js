var getRoomListQuery = "SELECT id, subject, description, json_build_object('id', owner, 'username', (SELECT username FROM users where id=owner)) as owner, (EXTRACT(epoch FROM created_at) * 1000)::int8 AS created_at FROM rooms";

var roomList = module.exports = function(client, logger, callback) {

  client.query(getRoomListQuery, [], function(err, result) {
    callback(result.rows);
  });

}
