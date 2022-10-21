const Client = require('ssh2-sftp-client');
const fs = require('fs')
const path = require('path')
const { logConsole, errorConsole } = require('@thesuhu/colorconsole')

const sftpconfig_default = {
    host: process.env.SFTP_HOST || '127.0.0.1',
    port: process.env.SFTP_PORT || 2222,
    user: process.env.SFTP_USR || 'anonymous',
    password: process.env.SFTP_PWD || 'anonymous',
    root_dir: process.env.SFTP_ROOT_DIR || ''
}

exports.list = async (remoteDir, config) => {
    let sftpconfig = config ? config : sftpconfig_default;
    let sftp = new Client();
    try {
        await sftp.connect(sftpconfig);
        // list remote dir
        let ls = await sftp.list(sftpconfig.root_dir + remoteDir)
        sftp.end()
        return ls
    } catch (err) {
        sftp.end()
        errorConsole(err.message)
        return { message: err.message }
    }
}

exports.uploadfile = async (localFile, remoteFile, isFast, config) => {
    let sftpconfig = config ? config : sftpconfig_default;
    let sftp = new Client();
    try {
        await sftp.connect(sftpconfig);
        // create dir if not exists
        let ensure = await ensureDir(sftpconfig.root_dir + path.parse(remoteFile).dir, sftp)
        if (ensure !== true) {
            sftp.end()
            return ensure
        }
        // upload file
        if (isFast) {
            await sftp.fastPut(localFile, sftpconfig.root_dir + remoteFile)
        } else {
            let localFileStream = fs.createReadStream(localFile)
            await sftp.put(localFileStream, sftpconfig.root_dir + remoteFile)
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

exports.uploadstream = async (buffer, remoteFile, config) => {
    let sftpconfig = config ? config : sftpconfig_default;
    let sftp = new Client();
    try {
        await sftp.connect(sftpconfig);
        // create dir if not exists
        let ensure = await ensureDir(sftpconfig.root_dir + path.parse(remoteFile).dir, sftp)
        if (ensure !== true) {
            sftp.end()
            return ensure
        }
        // upload file
        await sftp.put(buffer, sftpconfig.root_dir + remoteFile)
        sftp.end()
        logConsole('Upload successful')
        return { message: 'Upload successful' }
    } catch (err) {
        sftp.end()
        errorConsole(err.message)
        return { message: err.message }
    }
}

exports.multiuploadstream = async (arrBuffer, arrRemotefile, config) => {
    let sftpconfig = config ? config : sftpconfig_default;
    let sftp = new Client();
    try {
        await sftp.connect(sftpconfig);
        // upload file
        let statusupload = []
        for (let i = 0; i < arrBuffer.length; i++) {
            try {
                // create dir if not exists
                let ensure = await ensureDir(sftpconfig.root_dir + path.parse(arrRemotefile[i]).dir, sftp)
                if (ensure !== true) {
                    sftp.end()
                    errorConsole('Index: ' + i + ', ' + ensure.message)
                    statusupload.push({ index: i, message: 'err.message' })
                } else {
                    await sftp.put(arrBuffer[i], sftpconfig.root_dir + arrRemotefile[i])
                    logConsole('Index: ' + i + ', upload successful')
                    statusupload.push({ index: i, message: 'Upload successful' })
                }
            } catch (err) {
                errorConsole('Index: ' + i + ', ' + err.message)
                statusupload.push({ index: i, message: err.message })
            }
        }
        sftp.end()
        return statusupload
    } catch (err) {
        sftp.end()
        errorConsole(err.message)
        return { message: err.message }
    }
}

exports.downloadfile = async (localFile, remoteFile, isFast, config) => {
    let sftpconfig = config ? config : sftpconfig_default;
    let sftp = new Client();
    try {
        await sftp.connect(sftpconfig);
        // upload file
        if (isFast) {
            await sftp.fastGet(sftpconfig.root_dir + remoteFile, localFile)
        } else {
            let localFileStream = fs.createWriteStream(localFile)
            await sftp.get(sftpconfig.root_dir + remoteFile, localFileStream)
        }
        sftp.end()
        logConsole('Download successful')
        return { message: 'Download successful' }
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