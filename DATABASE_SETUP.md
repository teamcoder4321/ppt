# Database Configuration

This project supports multiple database types: SQLite, PostgreSQL, and MySQL.

## Quick Start

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set your database type in `.env`:
   ```
   DATABASE_TYPE=sqlite  # or 'postgres' or 'mysql'
   ```

3. Configure your database connection (see below for database-specific instructions)

## SQLite Configuration

SQLite is the default database and requires no additional setup. If no configuration is provided, it will create `app.db` in the current directory.

### Option 1: Using DATABASE_URL (Recommended)
```env
DATABASE_TYPE=sqlite
DATABASE_URL=./data/app.db  # Full path to the SQLite database file
# Or use sqlite:// prefix:
# DATABASE_URL=sqlite://./data/app.db
```

### Option 2: Using SQLITE_DIR
```env
DATABASE_TYPE=sqlite
SQLITE_DIR=./data  # Directory where the database file will be stored (defaults to current directory)
```

### Option 3: Default Behavior (No Configuration)
If neither `DATABASE_URL` nor `SQLITE_DIR` is set, the database will be created as `./app.db` in the current directory.

The database file will be created automatically if it doesn't exist.

## PostgreSQL Configuration

First, ensure PostgreSQL is installed and running.

### Option 1: Connection String
```env
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Option 2: Individual Settings
```env
DATABASE_TYPE=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
POSTGRES_DB=app
```

## MySQL Configuration

First, ensure MySQL is installed and running.

### Option 1: Connection String
```env
DATABASE_TYPE=mysql
DATABASE_URL=mysql://user:password@localhost:3306/dbname
```

### Option 2: Individual Settings
```env
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=app
```

## Running Migrations

After configuring your database, run the migrations to create the necessary tables:

```bash
npm run migrate
```

Note: Make sure to create the database before running migrations for PostgreSQL and MySQL.

## Environment Variables Priority

The system checks for database configuration in this order:
1. Database-specific environment variables (e.g., `POSTGRES_HOST`)
2. Generic database variables (e.g., `DB_HOST`)
3. Default values

## Production Considerations

- For SQLite in production with AWS EFS, set `EFS_MOUNT_PATH=/mnt/efs`
- For PostgreSQL and MySQL, use connection pooling for better performance
- Always use strong passwords and secure connections in production
- Consider using environment-specific `.env` files (`.env.local`, `.env.production`)
