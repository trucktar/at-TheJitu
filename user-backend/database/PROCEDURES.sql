-- Connect to the 'Accounts' database to create tables
USE Accounts;
GO

-- Create a new stored procedure called 'uspCreateUser' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspCreateUser
    @id VARCHAR(50),
    @username VARCHAR(150),
    @fullname VARCHAR(150),
    @email VARCHAR(255),
    @age TINYINT,
    @role VARCHAR(50) = 'Student',
    @password VARCHAR(255)
AS
INSERT INTO dbo.Users
VALUES
    ( @id, @username, @fullname, @email, @age, @role, @password );
GO

-- Create a new stored procedure called 'uspGetAllUsers' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspGetAllUsers
AS
SELECT *
FROM dbo.Users
GO

-- Create a new stored procedure called 'uspGetUserByUsername' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspGetUserByUsername
    @username VARCHAR(150)
AS
SELECT *
FROM dbo.Users
WHERE username = @username;
GO

-- Create a new stored procedure called 'uspGetUserByEmail' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspGetUserByEmail
    @email VARCHAR(255)
AS
SELECT *
FROM dbo.Users
WHERE email = @email;
GO

-- Create a new stored procedure called 'uspUpdateUser' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspUpdateUser
    @id VARCHAR(50),
    @username VARCHAR(150),
    @fullname VARCHAR(150),
    @email VARCHAR(255),
    @age TINYINT,
    @role VARCHAR(50) = 'Student',
    @password VARCHAR(255)
AS
UPDATE dbo.Users
SET
    username = @username,
    fullname = @fullname,
    email = @email,
    age = @age,
    role = @role,
    password = @password
WHERE id = @id;
GO

-- Create a new stored procedure called 'uspDeleteUser' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspDeleteUser
    @id VARCHAR(50)
AS
DELETE FROM dbo.Users
WHERE id=@id;
GO
