<p align="center">
  <img width="100px" src="https://github.com/gabedealmeida/DecentraFiles/blob/main/public/images/DecentraFilesLogo.png" alt="DecentraFiles" />
</p>

# DecentraFiles

DecentraFiles is an anonymous decentralized file storage. You pick the max download count and a time the file will expire, and we handle the rest!

[![build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/gabedealmeida/DecentraFiles/blob/main/README.md)

## DencentraFiles Demo
https://youtu.be/LD4rFRKrlrs

## Check Out What DecentraFiles Looks Like!
<p>
  <img width="80%" src="https://github.com/gabedealmeida/DecentraFiles/blob/main/public/images/DecentraFilesHomepage.png" alt="DecentraFiles" />
</p>

<p>
  <img width="80%" src="https://github.com/gabedealmeida/DecentraFiles/blob/main/public/images/DecentraFilesDownloadModal.png" alt="DecentraFiles" />
</p>

<p>
  <img width="80%" src="https://github.com/gabedealmeida/DecentraFiles/blob/main/public/images/DecentraFilesUploadFile.png" alt="DecentraFiles" />
</p>

## Build Instructions

| Step | Sction                                                                                                                                                                                                                                                                                                                                                        |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Install Postgres                                                                                                                                                                                                                                                                                                                                              |
| 2    | Install Redis                                                                                                                                                                                                                                                                                                                                                 |
| 3    | Create an S3 or Tardigrade account                                                                                                                                                                                                                                                                                                                            |
| 4    | Run the setup.sql file located in the root folde within your Postgres installation                                                                                                                                                                                                                                                                            |
| 5    | Create a .env file in the root of the download service. In it, store the following variables. All the ones not filled out must be filled out by you: HOST=localhost, PORT=8086, S3_ENDPOINT=, S3_ACCESSKEYID=, S3_SECRETACCESSKEY=, S3_BUCKET=, PGHOST=localhost, PGUSER=decentrafiles, PGDATABASE=decentrafiles, PGPASSWORD=secretsauce, PGPORT=, REDISPORT= |
| 6    | Similar to the above step, create a .env file in the root of the upload service: HOST=localhost, PORT=8085, S3_ENDPOINT=, S3_ACCESSKEYID=, S3_SECRETACCESSKEY=, S3_BUCKET=, PGHOST=localhost, PGUSER=decentrafiles, PGDATABASE=decentrafiles, PGPASSWORD=secretsauce, PGPORT=, REDISPORT=                                                                     |
| 7    | Similar to the above step, create a .env file in the root of the views service: HOST=localhost, PORT=8084                                                                                                                                                                                                                                                     |
| 8    | Run `npm install` from the root of the download, upload, and views service.                                                                                                                                                                                                                                                                                   |
| 9    | You're almost there! Now we have to make sure our servers are all on. Start by ensuring that your Redis installation is up and running. From the root of the download, upload, and views services, please run `npm start`.                                                                                                                                    |
| 10   | To view the application, in your browser, go to localhost:8080. Let us know what you think!                                                                                                                                                                                                                                                                   |
