CREATE DATABASE IF NOT EXISTS usersdb;
USE usersdb;
CREATE TABLE users (
    username varchar(255) PRIMARY KEY,
    userData json
);
ALTER TABLE users
CHANGE COLUMN nombre username varchar(255) PRIMARY KEY,
CHANGE COLUMN datos userData json;

DROP TABLE usuarios; //elimina la tabla
ALTER TABLE usuarios RENAME TO users;//renombra una tabla

describe ;
INSERT INTO employee VALUES
(1, "Joe", 1000),
(2, "Henry", 1500),
(3, "Sam", 2000),
(4, "Max", 2500);

SELECT * FROM users;
SELECT * FROM employee WHERE id = 1;
DELETE FROM employee WHERE id = 1;
UPDATE  employee SET name = ?, salary = ? WHERE  id = ?, [name, salary, id]