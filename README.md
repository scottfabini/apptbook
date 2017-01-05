## Synopsis

AppointmentBook (Calendar) Full Stack Web-App using js, jQuery, bootstrap, ajax, fullCalendar, node.js, postgres. <br>
An operational version running on aws can be accessed from www.scottfabini.com <br><br>
![alt tag](http://web.cecs.pdx.edu/~sfabini/apptbook-js.png)

## Motivation

This project is for CS510W Full-Stack Web Development course at Portland State University.

## Installation

Install postgresql to the server that will host server.js:
https://www.postgresql.org/download/ <br>
Configuration on a Mac OS X El Capitan localhost: <br>
```
brew install postgresql
initdb ./db -E utf8
pg_ctl -D ./ -l logfile start
brew tap homebrew/services
To start postgres: brew services start postgresql
To stop postgres: brew services stop postgresql
Homebrew installs the database to /usr/local/var/postgres.
createdb apptbookdb
brew Caskroom/versions/pgadmin3
```
Execute pgadmin3 from Applications folder. <br>
Create a database with columns: hashkey (numeric), and event (varchar of length 255)
![alt tag](http://web.cecs.pdx.edu/~sfabini/table_creation.png)
```
npm update
npm start
```
Navigate browser to localhost:8080/index.html <br>


## Contributors

Not Applicable.

## License

Copyright (c) 2016 Scott Fabini (scott.fabini@gmail.com)


Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.