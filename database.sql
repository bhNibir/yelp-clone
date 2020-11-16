CREATE DATABASE yelp;

CREATE TABLE restaurants (id BIGSERIAL PRIMARY KEY NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, street VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, province VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, postalcode VARCHAR(255) NOT NULL, longtitude VARCHAR(255), latitude VARCHAR(255), priceRange INT NOT NULL check(priceRange >= 1 and priceRange <= 5));

CREATE TABLE ratings (id BIGSERIAL PRIMARY KEY NOT NULL, restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE, rating NUMERIC NOT NULL check(rating >= 1 and rating <= 5), name VARCHAR(255) NOT NULL, message TEXT NOT NULL, timestamp timestamp default current_timestamp);

CREATE TABLE restaurant_images (id BIGSERIAL PRIMARY KEY NOT NULL, restaurant_id BIGINT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE, url_location TEXT NOT NULL)
