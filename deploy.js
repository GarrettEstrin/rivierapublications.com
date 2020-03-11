var FtpDeploy = require('ftp-deploy-log'),
ftpDeploy = new FtpDeploy(),
fs = require('fs'),
dotenv = require('dotenv').config(),
excluded = fs.readFileSync('../.gitignore', 'utf8');
excluded = excluded.split(/[\r\n]+/);
 
var config = {
    username: process.env.FTPUSER,
    password: process.env.FTPPASSWORD, // optional, prompted if none given 
    host: process.env.FTPHOST,
    port: 21,
    localRoot: __dirname,
    remoteRoot: "/",
    include: ['build/version.txt'],
    exclude: excluded,
    useLog: true
}
    
ftpDeploy.deploy(config, function(err) {
    if (err) console.log(err)
    else console.log('finished');
});

ftpDeploy.on('uploading', function(data) {
    data.totalFileCount;       // total file count being transferred 
    data.transferredFileCount; // number of files transferred 
    data.percentComplete;      // percent as a number 1 - 100 
    data.filename;             // partial path with filename being uploaded 
    console.log(data);
});