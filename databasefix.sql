CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `answer_question` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `createdAt` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updateAt` datetime DEFAULT NULL
);

CREATE TABLE `threads` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `createdAt` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updateAt` datetime DEFAULT NULL
);

CREATE TABLE `comments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT,
  `thread_id` INT,
  `content` TEXT NOT NULL,
  `createdAt` datetime DEFAULT (CURRENT_TIMESTAMP),
  `updateAt` datetime DEFAULT NULL
);

CREATE TABLE `weather` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `city` varchar(11) DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `weather_description` varchar(255) DEFAULT NULL,
  `humidity` varchar(255) DEFAULT NULL
);

CREATE TABLE `artikel` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `cover` TEXT DEFAULT NULL,
  `tanggal` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `deskripsi` TEXT DEFAULT NULL,
  `isi` TEXT DEFAULT NULL
);

CREATE TABLE `materi` (
  `id` int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `cover` TEXT DEFAULT NULL,
  `tanggal` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `deskripsi` TEXT DEFAULT NULL,
  `isi` TEXT DEFAULT NULL
);

ALTER TABLE `threads` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`thread_id`) REFERENCES `threads` (`id`);
