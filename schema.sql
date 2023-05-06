DROP TABLE IF EXISTS move1;

CREATE TABLE IF NOT EXISTS move1(
 id SERIAL PRIMARY KEY,
 title varchar(250),
 released int,
 summary varchar(250)
);