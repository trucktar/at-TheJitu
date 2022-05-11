USE ToDo;
GO

-- Create a new table called 'Tasks' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.Tasks', 'U') IS NOT NULL
DROP TABLE dbo.Tasks;
GO

-- Create the table in the specified schema
CREATE TABLE dbo.Tasks
(
    id            UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    title         VARCHAR(50)      NOT NULL,
    dueDate       SMALLDATETIME,
    assignee      VARCHAR(255)     NOT NULL,
    description   VARCHAR(300)     NOT NULL,
    dateCreated   SMALLDATETIME    DEFAULT GETDATE(),
    dateCompleted SMALLDATETIME,
    isComplete    BIT              DEFAULT 0
);
GO
