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


CREATE TABLE `note` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` TEXT,
  `submit_time` DATETIME,
  sound_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (sound_id) 
      REFERENCES sound(id)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;