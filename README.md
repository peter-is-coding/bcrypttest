# Testing out bcrypt

This is just a simple test of how to work with bcrypt on express, accounts stored in mongo with passwords hashed and salted.

This test has:

-   Account registration
-   Logins to existing account
-   Persistent session
-   Protected 'dashboard' route, implemented using route middleware to keep things DRY.
-   Logout / destroy session
