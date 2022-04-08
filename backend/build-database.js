const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./timeclock.db');

db.serialize(() => {
	// Create users table.
	db.run(`DROP TABLE IF EXISTS users`)
	.run(`CREATE TABLE users (
		id			INTEGER		PRIMARY KEY AUTOINCREMENT,
		username    CHAR(100)	NOT NULL,
		password	TEXT		NOT NULL,
		admin		BOOLEAN		NOT NULL
	)`);

	// Create shifts table.
	db.run(`DROP TABLE IF EXISTS shifts`)
	.run(`CREATE TABLE shifts (
		id			INTEGER		PRIMARY KEY AUTOINCREMENT,
		user_id		INTEGER		NOT NULL,
		start		DATETIME	NOT NULL,
		end			DATETIME,
		FOREIGN KEY(user_id) REFERENCES users(id)
	)`);

	// Create breaks table.
	db.run(`DROP TABLE IF EXISTS breaks`)
	.run(`CREATE TABLE breaks (
		id			INTEGER		PRIMARY KEY AUTOINCREMENT,
		shift_id	INTEGER		NOT NULL,
		start		DATETIME	NOT NULL,
		end			DATETIME,
		FOREIGN KEY(shift_id) REFERENCES shifts(id)
	)`);
});