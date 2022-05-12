-- Connect to the 'Accounts' database to create tables
USE Accounts
GO

-- Create a new table called 'Users' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
DROP TABLE dbo.Users
GO

-- Create the table in the specified schema
CREATE TABLE dbo.Users
(
    id       VARCHAR(50)  NOT NULL PRIMARY KEY,
    username VARCHAR(150) NOT NULL,
    fullname VARCHAR(150) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    age      TINYINT      NOT NULL,
    role     VARCHAR(50)  DEFAULT 'Student',
    password VARCHAR(255) NOT NULL
);
GO
