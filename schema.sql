drop database if exists employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department
(
    id int
    auto_increment primary key
    AUTO_INCREMENT,
  name varchar
    (30) NOT NULL

);

    CREATE TABLE role
    (
        id int
        auto_increment primary key
        AUTO_INCREMENT,
  title VARCHAR
        (30) NOT NULL,

salary DECIMAL,

department_id int


);

        CREATE TABLE employee
        (
            id int
            auto_increment primary key
        AUTO_INCREMENT,
  first_name VARCHAR
            (30) NOT NULL,

last_name VARCHAR
            (30) NOT NULL,

role_id int,

manager_id int


);