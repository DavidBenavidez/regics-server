import db from '../../database';

export const getLogs = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM log_data
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
