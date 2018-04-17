import db from '../../database';
import fs from 'fs';

export const getSuggestedAdviser = () => {
	return new Promise((resolve, reject) => {
    	var noOfAdviseeArray = getAllAdviseeClassification();  //{{empno, noOfAdvisee},{empno, noOfAdvisee}}
    	var suggestedAdviserArray = {};        // array of top 3 profs w/ least number of advisee

    	/* ipasok mo muna lahat sa suggestedArray then sort mo then kunin mo ung index 0-3 */
    	noOfAdviseeArray.sort(function (a, b) {
		  return a.total - b.total;
		});

		var count = 0;
		var status;
		var profName; 
		for(var i = 0; i < noOfAdviseeArray.length; i++){
			if(count == 3)        //if there are already top 3 advisers 
				return resolve(suggestedAdviserArray);
			/* query if active */
			var queryString = `SELECT name, status from system_user where empno=?`;
			db.query(queryString, noOfAdviseeArray[i].empno (err, row) => {
	          if (err) {
	            console.log(err);
	            return reject(500);
	          }
	          if (!row.length) {
	            return reject(404);
	          }
	          status = row[0].status;
	          profName = row[0].name;
	        });
			/* query end */

			if(status == 'active'){
				noOfAdviseeArray[i].name = profName;    //add the name of the prof 
				suggestedAdviserArray.push(noOfAdviseeArray[i]);      //add the obj to the suggestedArray
				count++;
			}
		}

  	});
};