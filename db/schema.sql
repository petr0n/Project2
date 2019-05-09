### Schema


CREATE DATABASE trashTaggerDb;
USE trashTaggerDb;

CREATE TABLE events
(
	id int NOT NULL AUTO_INCREMENT,
	eventTitle varchar(255) NOT NULL,
	eventLocation varchar(255) NOT NULL,
    googleGeoLocation varchar(255) NOT NULL,
    eventDesc TEXT NOT NULL,
    eventDateTime DATETIME NOT NULL,
    byob BOOLEAN DEFAULT NULL,
    userId INT NOT NULL, 
    createAt DATETIME DEFAULT now(),
    modifiedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);

CREATE TABLE users 
(
	id int NOT NULL AUTO_INCREMENT,
    fullName varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
    googleIdToken varchar(255) NOT NULL, 
    createAt DATETIME DEFAULT now(),
    modifiedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);

CREATE TABLE usersEvents
( 
    id int NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    eventId INT NOT NULL,
    PRIMARY KEY (id)
);