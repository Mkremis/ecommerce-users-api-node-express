-- MySQL database "ecommerce"  
drop  database if exists ecommerce;
create database if not exists ecommerce;
use ecommerce;

-- Crear la tabla users
DROP TABLE IF EXISTS users;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_k8d0f2n7n88w1a16yhua64onx` (`user_name`)
);

-- Crear la tabla users_dashboard
DROP TABLE IF EXISTS users_dashboard;
CREATE TABLE `users_dashboard` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first` varchar(255) DEFAULT NULL,
  `last` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `postcode` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `street_number` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_qc2oh1ekslwvf8t1ahsln20pl` (`email`),
  UNIQUE KEY `UK_d935mgxf5a968kf84c4mdkrid` (`phone`),
  UNIQUE KEY `UK_cd42db8r50c5653xjycohq57m` (`user_id`),
  CONSTRAINT `FK24q3hfs3t52l3bqfdfa6svc91` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);


-- Crear la tabla users_cart
DROP TABLE IF EXISTS users_cart;
CREATE TABLE `users_cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price_currency` varchar(255) DEFAULT NULL,
  `prod_gender` varchar(255) DEFAULT NULL,
  `prod_id` varchar(255) DEFAULT NULL,
  `prod_image` varchar(255) DEFAULT NULL,
  `prod_name` varchar(255) DEFAULT NULL,
  `prod_price` double DEFAULT NULL,
  `productq` int NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKabaa051488v7xuv6mhefq4j5s` (`user_id`,`prod_id`),
  CONSTRAINT `FKdn91r1vbqdmcgxrcnwxokfjys` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);


-- Crear la tabla users_likes
DROP TABLE IF EXISTS users_likes;
CREATE TABLE `users_likes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(255) DEFAULT NULL,
  `price_currency` varchar(255) DEFAULT NULL,
  `prod_gender` varchar(255) DEFAULT NULL,
  `prod_id` varchar(255) DEFAULT NULL,
  `prod_image` varchar(255) DEFAULT NULL,
  `prod_price` double DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe7oojpwqq3x5juu0irrfop8t6` (`user_id`,`prod_id`),
  CONSTRAINT `FK1qlx1ihlr9tdsiyav51nb6kt1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
-- Elimina la tabla si existe.
DROP TABLE IF EXISTS transactions;
-- Crear la tabla transactions
CREATE TABLE `transactions` (
  `id` bigint NOT NULL,
  `card_number` varchar(255) DEFAULT NULL,
  `currency_id` varchar(255) DEFAULT NULL,
  `order_type` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `shipping_amount` double DEFAULT NULL,
  `status_detail` varchar(255) DEFAULT NULL,
  `total_paid_amount` double DEFAULT NULL,
  `transaction_date` datetime(6) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKqwv7rmvc8va8rep7piikrojds` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

-- Elimina la tabla si existe.
DROP TABLE IF EXISTS purchases;
-- Crear la tabla purchases
CREATE TABLE `purchases` (
  `id` bigint NOT NULL,
  `price_currency` varchar(255) DEFAULT NULL,
  `prod_gender` varchar(255) DEFAULT NULL,
  `prod_id` varchar(255) DEFAULT NULL,
  `prod_image` varchar(255) DEFAULT NULL,
  `prod_name` varchar(255) DEFAULT NULL,
  `prod_price` double DEFAULT NULL,
  `productq` int NOT NULL,
  `order_id` bigint DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FKm0ndjymn9p747pfp4515pio8i` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKr02hj6vc1iklg7487n4xrpbys` FOREIGN KEY (`order_id`) REFERENCES `transactions` (`id`)
);

-- Crear la tabla role
DROP TABLE IF EXISTS role;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Insertar roles iniciales en la tabla role
INSERT INTO role (role_name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');


-- Crear la tabla user_role
DROP TABLE IF EXISTS user_role;
CREATE TABLE `user_role` (
  `user_id` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  CONSTRAINT `FKa68196081fvovjhkek5m97n3y` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `FKj345gk1bovqvfame88rcx7yyx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);
