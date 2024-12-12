CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,
    operation VARCHAR(10),
    table_name VARCHAR(64),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to log operations on Books table
CREATE OR REPLACE FUNCTION log_books_operations()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO logs (operation, table_name, details)
    VALUES ('INSERT', 'Books', 'New book added with ISBN: ' || NEW."ISBN");
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO logs (operation, table_name, details)
    VALUES ('UPDATE', 'Books', 'Book updated with ISBN: ' || NEW."ISBN");
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO logs (operation, table_name, details)
    VALUES ('DELETE', 'Books', 'Book deleted with ISBN: ' || OLD."ISBN");
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Books table
CREATE TRIGGER books_trigger
AFTER INSERT OR UPDATE OR DELETE ON public."Books"
FOR EACH ROW
EXECUTE FUNCTION log_books_operations();


-- Function to log operations on BookDetails table
CREATE OR REPLACE FUNCTION log_bookdetails_operations()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO logs (operation, table_name, details)
    VALUES ('UPDATE', 'BookDetails',
            'Stock updated for ISBN: ' || NEW."ISBN" || ', new stock: ' || NEW.stock);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for BookDetails table
CREATE TRIGGER bookdetails_trigger
AFTER UPDATE ON public."BookDetails"
FOR EACH ROW
EXECUTE FUNCTION log_bookdetails_operations();


-- Function to log operations on Users table
CREATE OR REPLACE FUNCTION log_users_operations()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO logs (operation, table_name, details)
    VALUES ('UPDATE', 'Users',
            'User information updated for userID: ' || NEW."userID");
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO logs (operation, table_name, details)
    VALUES ('DELETE', 'Users', 'User deleted with userID: ' || OLD."userID");
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for Users table
CREATE TRIGGER users_trigger
AFTER UPDATE OR DELETE ON public."Users"
FOR EACH ROW
EXECUTE FUNCTION log_users_operations();


-- Function to log user creation
CREATE OR REPLACE FUNCTION log_user_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO logs (operation, table_name, details)
  VALUES ('INSERT', 'Users', 
          'New user created with userID: ' || NEW."userID" || 
          ', email: ' || NEW."email");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user creation
CREATE TRIGGER user_creation_trigger
AFTER INSERT ON public."Users"
FOR EACH ROW
EXECUTE FUNCTION log_user_creation();


-- Create a table to store user login events
CREATE TABLE public."UserLoginLogs" (
    "loginID" SERIAL PRIMARY KEY,
    "userID" INTEGER NOT NULL,
    "login_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userID") REFERENCES public."Users"("userID") ON DELETE CASCADE
);

-- Function to log user login attempts
CREATE OR REPLACE FUNCTION log_user_login_attempt()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO logs (operation, table_name, details)
  VALUES ('INSERT', 'UserLoginLogs', 
          'User with userID: ' || NEW."userID" || ' logged in at ' || NEW."login_time");
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user login logging
CREATE TRIGGER user_login_trigger
AFTER INSERT ON public."UserLoginLogs"
FOR EACH ROW
EXECUTE FUNCTION log_user_login_attempt();

