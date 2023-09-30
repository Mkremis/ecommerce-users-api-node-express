CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP table if exists users;
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    login_username VARCHAR(15) NOT NULL UNIQUE,
    login_password VARCHAR(8) NOT NULL,
    fullname_title VARCHAR(5),
    fullname_first VARCHAR(30),
    fullname_last VARCHAR(30),
    contact_email VARCHAR(50) NOT NULL UNIQUE,
    contact_phone VARCHAR(10) UNIQUE,
    picture_thumbnail TEXT,
    location_city VARCHAR(20),
    location_state VARCHAR(20),
    location_number VARCHAR(20),
    location_street VARCHAR(20),
    location_country VARCHAR(20),
    location_postcode VARCHAR(10)
);

DROP table if exists user_cart;
CREATE TABLE user_cart (
    user_id UUID REFERENCES users(id),
    user_cart JSON,
    PRIMARY KEY (user_id)
);

INSERT INTO users (login_username, login_password, fullname_title, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode)
VALUES ('elvis_presley', '12345678', 'Sr.', 'Elvis', 'Presley', 'elvis@example.com', '1234567890', 'https://ruta-de-la-imagen.com/elvis.jpg', 'Memphis', 'Tennessee', '123 Graceland Lane', 'Sun Records', 'Estados Unidos', '38116');

SELECT * FROM users WHERE login_username = 'elvis_presley';
