var checkPhonenumberQuery = "select exists(select id from users where phone_number=btrim($1, ' '))";

var checkPhonenumber = module.exports = function(client, phone_number, logger, callback) {

    client.query(checkPhonenumberQuery, [phone_number], function(err, result) {

      if(err) {
        logger.error("Error occured when checking phone_number", err);
      }

      logger.debug('Got result', result.rows[0], 'from db');
      callback(result.rows[0]);

  });
}
