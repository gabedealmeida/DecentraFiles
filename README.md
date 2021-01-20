# DecentraFiles

DecentraFiles is an anonymous decentralized file storage. You pick the max download count and a time the file will expire, and we handle the rest!

## Build Instructions

| Step | Sction                                                                                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Install Postgres                                                                                                                                     |
| 2    | Install redis                                                                                                                                        |
| 3    | Run the setup.sql file located in the root folde within your Postgres installation                                                                   |
| 4    | Create a .env file in the root of the download service. In it, store the following variables. All the ones not filled out must be filled out by you: HOST=localhost, PORT=8086, S3_ENDPOINT=, S3_ACCESSKEYID=, S3_SECRETACCESSKEY=, S3_BUCKET=, PGHOST=localhost, PGUSER=decentrafiles, PGDATABASE=decentrafiles, PGPASSWORD=secretsauce, PGPORT=, REDISPORT= |
| 5    | Similar to the above step, create a .env file in the root of the upload service: HOST=localhost, PORT=8085, S3_ENDPOINT=, S3_ACCESSKEYID=, S3_SECRETACCESSKEY=, S3_BUCKET=, PGHOST=localhost, PGUSER=decentrafiles, PGDATABASE=decentrafiles, PGPASSWORD=secretsauce, PGPORT=, REDISPORT= |
| 6    | Similar to the above step, create a .env file in the root of the views service: HOST=localhost, PORT=8084 |
| 7    | Run `npm install` from the root of the download, upload, and views service. |
| 8    | You're almost there! Now we have to make sure our servers are all on. Start by ensuring that your Redis installation is up and running. From the root of the download, upload, and views services, please run `npm start`. |
| 9    | To view the application, in your browser, go to localhost:8080 |
| 10    | That's it! |
