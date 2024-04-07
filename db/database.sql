-- postgreSQL database "ecommerce"  
-- Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  roles VARCHAR(255)[] NOT NULL
);

-- Crear la tabla users_dashboard
CREATE TABLE IF NOT EXISTS users_dashboard (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT null REFERENCES users(id) UNIQUE,
  title VARCHAR(255),
  first VARCHAR(255),
  last VARCHAR(255),
  email varchar(255) unique,
  phone VARCHAR(255) unique,
  thumbnail VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  street_number VARCHAR(255),
  street VARCHAR(255),
  country VARCHAR(255),
  postcode VARCHAR(255)
);

-- Crear la tabla users_cart
CREATE TABLE IF NOT EXISTS users_cart (
  id SERIAL PRIMARY KEY,
  prod_id VARCHAR(255) NOT NULL,
  prod_name VARCHAR(255),
  prod_price NUMERIC,
  prod_image VARCHAR(255),
  price_currency VARCHAR(255),
  prod_gender VARCHAR(255),
  productq INT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  CONSTRAINT unique_user_prod_id UNIQUE (user_id, prod_id)
);


-- Crear la tabla users_likes
CREATE TABLE IF NOT EXISTS users_likes (
  id SERIAL PRIMARY KEY,
  prod_id VARCHAR(255) ,
  prod_name VARCHAR(255),
  prod_price NUMERIC, -- Cambiado a NUMERIC para representar números con precisión
  prod_image VARCHAR(255),
  price_currency VARCHAR(255),
  prod_gender VARCHAR(255),
  user_id UUID NOT null REFERENCES users(id) 
);

-- Crear la tabla purchases
CREATE TABLE IF NOT EXISTS purchases (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  order_id CHAR(11),
  prod_id VARCHAR(255) NOT NULL,
  prod_name VARCHAR(255),
  prod_price NUMERIC,
  prod_image VARCHAR(255),
  prod_gender VARCHAR(255),
  productq INT NOT NULL
);

-- Crear la tabla transactions
CREATE TABLE IF NOT EXISTS transactions (
  id CHAR(11) not NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  transaction_date DATE NOT NULL,
  status_detail VARCHAR(255) NOT NULL,
  payment_method VARCHAR(255) NOT NULL,
  total_paid_amount NUMERIC NOT NULL,
  shipping_amount NUMERIC NOT NULL,
  card_number VARCHAR(255) NOT NULL,
  order_type VARCHAR(255) NOT NULL,
  currency_id VARCHAR(255) NOT NULL
);

-- Crear la tabla role
CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL
);

-- Insertar roles iniciales en la tabla role
INSERT INTO role (role_name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- Crear la tabla user_role
CREATE TABLE IF NOT EXISTS user_role (
  user_id UUID NOT NULL REFERENCES users(id),
  role_id INT NOT NULL REFERENCES role(id),
  PRIMARY KEY (user_id, role_id)
);

-- Habilitar la extensión uuid-ossp para generar UUIDs automáticamente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
