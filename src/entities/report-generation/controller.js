import db from '../../database';
import fs from 'fs';
const Json2csvParser = require('json2csv').Parser;

export const getUser = () => {
  return new Promise((resolve, reject) => {
    const queryString = `
        SELECT 
          *
        FROM 
          system_user
      `;

    // const fields = ['car', 'price', 'color'];
    // const myCars = [
    // {
    //   "car": "Audi",
    //   "price": 40000,
    //   "color": "blue"
    // }, {
    //   "car": "BMW",
    //   "price": 35000,
    //   "color": "black"
    // }, {
    //   "car": "Porsche",
    //   "price": 60000,
    //   "color": "green"
    // }
    // ];

    // const json2csvParser = new Json2csvParser({ fields });
    // const csv = json2csvParser.parse(myCars);

    // console.log(csv);

    db.query(queryString, (err, rows) => {
      if (err) {
        console.log(err);
        return reject(500);
      }

      if (!rows.length) {
        return reject(404);
      }

      const fields = [
        'empno',
        'name',
        'username',
        'email',
        'pw',
        'pos',
        'stat',
        'tload',
        'isadvuser'
      ];
      const json2csvParser = new Json2csvParser({ fields });
      const csv = json2csvParser.parse(rows);

      console.log(csv);

      return resolve({ data: csv });
    });
  });
};
