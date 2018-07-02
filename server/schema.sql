CREATE DATABASE `soundnotes` DEFAULT CHARACTER SET utf8mb4;

USE `soundnotes`;

CREATE TABLE `sound` (
  id INT NOT NULL AUTO_INCREMENT,
  `title` TEXT,
  `start_time` DATETIME,
  `end_time` DATETIME,
  `data_URL` TEXT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `notes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` TEXT,
  `submit_time` DATETIME,
  `title` TEXT,
  sound_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (sound_id) 
      REFERENCES sound(id)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `sound` (`id`,`title`, `start_time`,`end_time`,`data_URL`) VALUES (1,'title-1', '2016-01-01 00:01:00' ,'2016-01-01 00:01:00','testurl');
INSERT INTO `sound` (`id`,`title`, `start_time`,`end_time`,`data_URL`) VALUES (1,'title-1', '2016-01-01 00:01:00' ,'2016-01-01 00:01:00','testurl');
INSERT INTO `sound` (`id`,`title`, `start_time`,`end_time`,`data_URL`) VALUES (1,'title-1', '2016-01-01 00:01:00' ,'2016-01-01 00:01:00','testurl');
INSERT INTO `sound` (`id`,`title`, `start_time`,`end_time`,`data_URL`) VALUES (1,'title-1', '2016-01-01 00:01:00' ,'2016-01-01 00:01:00','testurl');

INSERT INTO `sound` (`name`, `price`) VALUES ('Item 1', 100);