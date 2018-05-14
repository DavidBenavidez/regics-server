import db from '../../database';
import { getOffset } from '../utils/';

export const getLogs = page => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        log_no, 
        DATE_FORMAT(log_timestamp, '%Y %b %d %h:%i %p') AS log_timestamp,
        log_action,
        log_user
      FROM 
        log_data
      ORDER BY
        log_timestamp
        DESC
      LIMIT 15
      OFFSET ?
    `;
    db.query(query, getOffset(15, page), (err, row) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      if (!row) return reject(404);

      return resolve(row);
    });
  });
};
