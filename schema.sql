DROP TABLE IF EXISTS move1;

CREATE TABLE IF NOT EXISTS move1(
 id SERIAL PRIMARY KEY,
 title varchar(250),
 poster_path varchar(250),
 overveiw varchar(250),
 release_date Date
);