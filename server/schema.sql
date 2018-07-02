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
  sound_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (sound_id) 
      REFERENCES sound(id)
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `sound` (`title`, `start_time`,`end_time`,`data_URL`) VALUES ('title-1', '2016-01-01 00:01:00' ,'2016-01-01 00:01:50','testurl');
INSERT INTO `sound` (`title`, `start_time`,`end_time`,`data_URL`) VALUES ('title-2', '2016-01-02 00:01:00' ,'2016-01-02 00:01:50','testurl');
INSERT INTO `sound` (`title`, `start_time`,`end_time`,`data_URL`) VALUES ('title-3', '2016-01-03 00:01:00' ,'2016-01-03 00:01:50','testurl');
INSERT INTO `sound` (`title`, `start_time`,`end_time`,`data_URL`) VALUES ('title-4', '2016-01-04 00:01:00' ,'2016-01-04 00:01:50','testurl');
INSERT INTO `sound` (`title`, `start_time`,`end_time`,`data_URL`) VALUES ('title-5', '2016-01-05 00:01:00' ,'2016-01-05 00:01:50','testurl');


INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('今日はいい天気','2016-01-01 00:01:00',1);
INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('今日はああ天気','2016-01-01 00:01:02',1);
INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('今日はうう天気','2016-01-01 00:01:03',1);

INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('明日はいい天気','2016-01-01 00:01:00',2);
INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('明日はああ天気','2016-01-01 00:01:02',2);
INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('明日はうう天気','2016-01-01 00:01:03',2);

INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('昨日はいい天気','2016-01-01 00:01:00',3);
INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('昨日はああ天気','2016-01-01 00:01:02',3);
INSERT INTO `notes` (`text`, `submit_time`,`sound_id`) VALUES ('昨日はうう天気','2016-01-01 00:01:03',3);