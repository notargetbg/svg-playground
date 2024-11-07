import { db } from '../core/db';

// Model talks to the DB, and returns the data to the service, not the controller
// We split the logic and we achieve a better separation of concerns
class UserModel {
  // we create a method that will return all the users from the database
  public async getUsers() {
	return new Promise((resolve, reject) => {
	  db.query('SELECT * FROM users', (err, results) => {
		if (err) {
		  return reject(err);
		}
		return resolve(results);
	  });
	});
  }
}

export default UserModel;