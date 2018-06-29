REFERENCE: https://dev.mysql.com/doc/refman/5.6/ja/

```mysql
/* Create database */
CREATE DATABASE `my_database_name` DEFAULT CHARACTER SET utf8mb4;

/* Select active database */
USE `my_database_name`;

/* Create table */
CREATE TABLE `my_table_name` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` TEXT,
  `price` FLOAT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* List tables */
SHOW TABLES;

/* Insert item into table */
INSERT INTO `my_table_name` (`name`, `price`) VALUES ('Item 1', 100);

/* List all items in a table */
SELECT * FROM `my_table_name`;

/* Database delete */
DROP DATABASE my_store;
```
