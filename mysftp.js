const Client = require('ssh2-sftp-client');
const fs = require('fs')
const path = require('path')
const { logConsole, errorConsole } = require('@thesuhu/colorconsole')

const sftpconfig_default = {
    host: process.env.SFTP_HOST || '127.0.0.1',
    port: process.env.SFTP_PORT || 2222,
    user: process.env.SFTP_USR || 'anonymous',
    password: process.env.SFTP_PWD || 'anonymous'
}

exports.list = async (remoteDir, config) => {
    let sftpconfig = config ? config : sftpconfig_default;
    let sftp = new Client();
    try {
        await sftp.connect(sftpconfig);
        // list remote dir
        let ls = await sftp.list(remoteDir)
        sftp.end()
        return ls
    } catch (err) {
        sftp.end()
        errorConsole(err.message)
        return { message: err.message }
    }
}

exports.uploadFile = async (localFile, remoteFile, isFast, config) => {
    let sftpconfig = config ? config : sftpconfig_default;
    let sftp = new Client();
    try {
        await sftp.connect(sftpconfig);
        // create dir if not exists
        let ensure = await ensureDir(path.parse(remoteFile).dir, sftp)
        if (ensure !== true) {
            sftp.end()
            return ensure
        }
        // upload file
        if (isFast) {
            await sftp.fastPut(localFile, remoteFile)
        } else {
            let localFileStream = fs.createReadStream(localFile)
            await sftp.put(localFileStream, remoteFile)
        }
        sftp.end()
        logConsole('Upload successful')
        return { message: 'Upload successful' }
    } catch (err) {
        sftp.end()
        errorConsole(err.message)
        return { message: err.message }
    }
}

async function ensureDir(remoteDir, sftp) {
    try {
        // check if remote dir exists
        let exists = await sftp.exists(remoteDir)
        if (exists) {
            return true
        } else {
            // create remote dir
            await sftp.mkdir(remoteDir, true)
            return true
        }
    } catch (err) {
        errorConsole(err.message)
        return { message: err.message }
    }
}