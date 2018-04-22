import db from '../../database';

export const getLogs = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        log_no, 
        DATE_FORMAT(log_timestamp, '%M %d %Y %h:%i %p') AS log_timestamp,
        log_action,
        log_user
      FROM 
        log_data
      ORDER BY
        log_timestamp
      DESC
    `;
    db.query(query, (err, row) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      if (!row) return reject(404);

      return resolve(row);
    });
  });
};
