/*
SQLyog Professional v13.1.1 (64 bit)
MySQL - 10.4.6-MariaDB : Database - richard
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`richard` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `richard`;

/*Table structure for table `admin_notifications` */

DROP TABLE IF EXISTS `admin_notifications`;

CREATE TABLE `admin_notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `system_message` text DEFAULT NULL,
  `is_read` tinyint(5) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;

/*Data for the table `admin_notifications` */

insert  into `admin_notifications`(`id`,`user_id`,`system_message`,`is_read`,`created_at`,`updated_at`) values 
(9,220,'New customer was registered to website',1,'2020-10-02 10:46:51','2020-10-02 17:46:51'),
(19,239,'New customer was registered to website',1,'2020-10-16 13:35:31','2020-10-16 13:35:31'),
(20,240,'New customer was registered to website',1,'2020-10-16 13:35:31','2020-10-16 13:35:31'),
(22,242,'New customer was registered to website',1,'2020-10-19 10:22:05','2020-10-19 10:22:05'),
(24,244,'New customer was registered to website',1,'2020-10-19 10:36:48','2020-10-19 10:36:48'),
(28,253,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(29,255,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(30,256,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(31,257,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(32,258,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(33,259,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(34,260,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(35,261,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(36,262,'New driver was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(37,263,'New customer was registered to website',1,'2020-11-04 09:17:18','2020-11-03 16:17:18'),
(38,264,'New customer was registered to website',1,'2020-11-06 22:23:55','2020-11-06 05:23:55');

/*Table structure for table `notifications` */

DROP TABLE IF EXISTS `notifications`;

CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `driver_id` bigint(20) unsigned NOT NULL,
  `driver_message` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` smallint(6) DEFAULT 0,
  `passenger_id` bigint(20) DEFAULT NULL,
  `departure` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_time` varbinary(255) DEFAULT NULL,
  `number_people` int(10) DEFAULT NULL,
  `trip_fare` int(10) DEFAULT 0,
  `trip_distance` double DEFAULT 0,
  `passenger_message` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_system_message` tinyint(4) DEFAULT 0,
  `system_message` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(2) DEFAULT NULL COMMENT '0=>cancel or reject,1=>accept, 2=>earned, 3=>admin msg',
  `whose_notify` tinyint(2) DEFAULT 0 COMMENT '0=>passenger, 1=>driver',
  `order_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`driver_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=407 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `notifications` */

insert  into `notifications`(`id`,`driver_id`,`driver_message`,`is_read`,`passenger_id`,`departure`,`destination`,`order_time`,`number_people`,`trip_fare`,`trip_distance`,`passenger_message`,`is_system_message`,`system_message`,`status`,`whose_notify`,`order_id`,`created_at`,`updated_at`) values 
(406,252,NULL,1,264,NULL,NULL,NULL,NULL,0,0,NULL,1,'Artem accepted your ride',1,0,NULL,'2020-11-18 23:56:32','2020-11-18 23:58:01');

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `passenger_id` bigint(20) unsigned NOT NULL,
  `driver_id` bigint(20) unsigned NOT NULL,
  `departure` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_time` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_people` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `car_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double unsigned NOT NULL DEFAULT 1,
  `trip_distance` double DEFAULT 0,
  `message` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(2) unsigned DEFAULT NULL COMMENT '0=>pending,1=>completed,2=>canceled,3=>accepted',
  `is_paid` tinyint(2) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `passenger_id` (`passenger_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`passenger_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=255 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `orders` */

insert  into `orders`(`id`,`passenger_id`,`driver_id`,`departure`,`destination`,`order_time`,`number_people`,`car_type`,`price`,`trip_distance`,`message`,`status`,`is_paid`,`created_at`,`updated_at`) values 
(254,264,252,'1235 Ayala Drive, Sunnyvale, CA, USA','1213 Newell Road, Palo Alto, CA, USA','12:20','4',NULL,12,6.21,'You have a new ride request from Amar',1,0,'2020-11-18 23:49:43','2020-11-18 23:56:32');

/*Table structure for table `ratings` */

DROP TABLE IF EXISTS `ratings`;

CREATE TABLE `ratings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `passenger_id` bigint(20) unsigned NOT NULL,
  `driver_id` bigint(20) unsigned NOT NULL,
  `review` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` tinyint(5) unsigned DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`passenger_id`),
  KEY `from_user_id` (`driver_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`passenger_id`) REFERENCES `users` (`id`),
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `ratings` */

/*Table structure for table `ride_history` */

DROP TABLE IF EXISTS `ride_history`;

CREATE TABLE `ride_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `passenger_id` bigint(20) unsigned NOT NULL,
  `departure` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_people` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_id` bigint(20) unsigned NOT NULL,
  `price` double unsigned NOT NULL DEFAULT 0,
  `status` tinyint(2) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `passenger_id` (`passenger_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `ride_history_ibfk_1` FOREIGN KEY (`passenger_id`) REFERENCES `users` (`id`),
  CONSTRAINT `ride_history_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `ride_history` */

/*Table structure for table `settings` */

DROP TABLE IF EXISTS `settings`;

CREATE TABLE `settings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `radius` double unsigned NOT NULL DEFAULT 10,
  `fee` double unsigned NOT NULL DEFAULT 0,
  `fare_per_mile` double DEFAULT 1,
  `cancel_fee` double DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `settings` */

insert  into `settings`(`id`,`radius`,`fee`,`fare_per_mile`,`cancel_fee`,`created_at`,`updated_at`) values 
(1,1000,1.5,2,10,NULL,'2020-10-22 12:24:53');

/*Table structure for table `social_accounts` */

DROP TABLE IF EXISTS `social_accounts`;

CREATE TABLE `social_accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `social_id` varchar(255) NOT NULL,
  `social_name` varchar(255) DEFAULT NULL,
  `social_provider` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

/*Data for the table `social_accounts` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `card_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `email_verified` enum('Yes','No') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'No',
  `phone_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_vendor` tinyint(1) NOT NULL DEFAULT 0,
  `role` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=>passenger, 1=>driver, 2=>admin',
  `balance` double NOT NULL DEFAULT 0,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `current_location` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT 0,
  `is_actived` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=265 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`name`,`lastname`,`photo`,`address`,`phone`,`email`,`password`,`card_token`,`remember_token`,`created_at`,`updated_at`,`email_verified`,`phone_verified`,`is_vendor`,`role`,`balance`,`latitude`,`longitude`,`current_location`,`is_online`,`is_actived`) values 
(220,'Admin','Admin','1603206577.png',NULL,'+123456789','admin@gmail.com','$2y$10$hujc8b9qFWcBsNu/psY04eLNxPN/rcV4TeSVV5i7Pl.tvkCHDFetG','','Mj1sMWsSIfA57ZWCkmW2wVIRL2mTClKVJdGt24eIVjwquU8jfJvwXehPg6mx','2020-10-02 15:11:22','2020-10-20 08:09:37','No',0,0,2,0,46.18885589399998,-123.83173786159159,'1105 Commercial St, Astoria, OR 97103, USA',0,0),
(252,'Artem','','1603893222.jpeg',NULL,'15037917848','artem.pobedennyi309@gmail.com','$2y$10$dQiLlw8jpqTaQ.17Dt6TmOygEGdMQ/knTb9O53OHzcrj1MUPeozsG','',NULL,'2020-10-28 06:53:43','2020-11-23 08:25:48','No',0,0,1,6,37.421056,-122.0870144,'1801 Landings Dr, Mountain View, CA 94043, USA',1,1),
(263,'Kaiwen','Kaiwen','1604076642.jpeg',NULL,'447511355757','kaiwen.chen0527@outlook.com','$2y$10$1yOt383DQ6BrELfy4gZrWefim3j9q3CzBcpvvWQgtm57D.3bsSrte','cus_IIc5XSVdcah91T','PMZtmUcsQgPJ0OxAbwYZIongQzdDQpepgHEPcowCaae1wwzZ8Bydmu9rHCKx','2020-10-30 09:50:42','2020-10-30 09:50:42','No',1,0,0,0,NULL,NULL,NULL,0,0),
(264,'Amar','Chen','1604668832.jpeg',NULL,'16462622821','amar.chan9655@gmail.com','$2y$10$P/N2Blkfb5V7FeKPM2kXdOt4MD2.v2EUeGM09DlBwxMj3PY4QDpeO','cus_ILBHLlW9O30DPo','9jdViqjYApxTUeYIqEMBFVXudsj4rTTvn2mQ1pjIzDryHAcsB79ah9BAF31Y','2020-11-06 05:20:32','2020-11-06 05:20:32','No',1,0,0,0,NULL,NULL,NULL,0,0);

/*Table structure for table `vehicles` */

DROP TABLE IF EXISTS `vehicles`;

CREATE TABLE `vehicles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `driver_id` bigint(20) unsigned NOT NULL,
  `car_brand` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `car_model` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `car_plate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `car_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`driver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `vehicles` */

insert  into `vehicles`(`id`,`driver_id`,`car_brand`,`car_model`,`car_plate`,`car_image`,`created_at`,`updated_at`) values 
(194,252,'Volvo','Volvo','123456','1603893222.jpeg','2020-10-28 06:53:43','2020-10-28 06:53:43');

/*Table structure for table `withdraw` */

DROP TABLE IF EXISTS `withdraw`;

CREATE TABLE `withdraw` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `method` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` float unsigned DEFAULT 0,
  `fee` float unsigned DEFAULT 0,
  `card_number` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exp_month` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exp_year` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cvc` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(5) unsigned DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `withdraw_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `withdraw` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
