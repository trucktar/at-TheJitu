USE ToDo;
GO

-- Create a new stored procedure called 'uspCreateOrUpdateTask' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspCreateOrUpdateTask
    @id UNIQUEIDENTIFIER = NULL,
    @title VARCHAR(30),
    @description VARCHAR(300) = '',
    @dueDate SMALLDATETIME = NULL
AS
DECLARE @taskExists BIT;

IF @id IS NULL
INSERT INTO dbo.Tasks
    (title, [description], dueDate)
VALUES
    (@title, @description, @dueDate);

ELSE
BEGIN
    SELECT @taskExists = COUNT(*)
    FROM dbo.Tasks
    WHERE id = @id

    IF @taskExists = 1
        UPDATE dbo.Tasks
        SET
            title = @title,
            [description] = @description,
            dueDate = @dueDate
        WHERE id = @id;
END
GO


-- Create a new stored procedure called 'uspGetAllTasks' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspGetAllTasks
AS
SELECT *
FROM dbo.Tasks;
GO


-- Create a new stored procedure called 'uspGetTaskById' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspGetTaskById
    @id UNIQUEIDENTIFIER
AS
SELECT *
FROM dbo.Tasks
where @id = id;
GO


-- Create a new stored procedure called 'uspCheckTaskStatus' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspCheckTaskStatus
    @id UNIQUEIDENTIFIER
AS
SELECT isComplete
FROM dbo.Tasks
WHERE id = @id;
GO


-- Create a new stored procedure called 'uspUpdateTaskStatus' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspUpdateTaskStatus
    @id UNIQUEIDENTIFIER
AS
DECLARE @isComplete BIT;
BEGIN
    SELECT @isComplete = isComplete
    FROM dbo.Tasks
    WHERE id = @id;

    UPDATE dbo.Tasks
        SET isComplete = (
            CASE
                WHEN @isComplete = 0 THEN 1
                ELSE 0
            END
            ),
            dateCompleted = (
            CASE
                WHEN @isComplete = 0 THEN GETDATE()
                ELSE NULL
            END
            )
    WHERE id = @id;
END
GO


-- Create a new stored procedure called 'uspDeleteTask' in schema 'dbo'
CREATE OR ALTER PROCEDURE dbo.uspDeleteTask
    @id UNIQUEIDENTIFIER
AS
DELETE FROM dbo.Tasks
WHERE id = @id;
GO
