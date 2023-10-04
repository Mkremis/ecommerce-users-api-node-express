CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP table if exists users CASCADE;
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    title VARCHAR(5),
    first VARCHAR(30),
    last VARCHAR(30),
    email VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(10) UNIQUE,
    thumbnail TEXT,
    city VARCHAR(20),
    state VARCHAR(20),
    street_number VARCHAR(20),
    street VARCHAR(20),
    country VARCHAR(20),
    postcode VARCHAR(10)
);

DROP table if exists users_cart;
CREATE TABLE users_cart (
    user_id UUID REFERENCES users(id),
    user_cart JSON,
    PRIMARY KEY (user_id)
);

DROP table if exists users_likes;
CREATE TABLE users_likes (
    user_id UUID REFERENCES users(id),
    user_likes JSON,
    PRIMARY KEY (user_id)
);

INSERT INTO users (login_username, login_password, fullname_title, fullname_first, fullname_last, contact_email, contact_phone, picture_thumbnail, location_city, location_state, location_number, location_street, location_country, location_postcode)
VALUES ('elvis_presley', '12345678', 'Sr.', 'Elvis', 'Presley', 'elvis@example.com', '1234567890', 'https://ruta-de-la-imagen.com/elvis.jpg', 'Memphis', 'Tennessee', '123 Graceland Lane', 'Sun Records', 'Estados Unidos', '38116');

SELECT * FROM users;

DELETE FROM users WHERE login_username = 'elvis_presley';