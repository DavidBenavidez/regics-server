import db from '../../database';

export const countItems = (table, m) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS total
      FROM ??
    `;

    db.query(query, [table], (err, result) => {
      if (err) {
        console.log(err.message);
        return reject(500);
      }

      return resolve({
        items: result[0].total,
        pages: Math.ceil(result[0].total / m)
      });
    });
  });
};

export const getOffset = (m, page) => {
  return m * (page - 1);
};
