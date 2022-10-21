# mysftp

[![npm](https://img.shields.io/npm/v/mysftp.svg?style=flat-square)](https://www.npmjs.com/package/@thesuhu/mysftp)
[![license](https://img.shields.io/github/license/thesuhu/mysftp?style=flat-square)](https://github.com/thesuhu/mysftp/blob/master/LICENSE)

Work with SFTP easily.

## Install

`
npm install mysftp --save
`

## Variables

This module will read four environment variables. If it doesn't find the related environment variable it will read the default value.

* **SFTP_HOST:** SFTP server address. (default: `localhost`) 
* **SFTP_PORT:** SFTP port. (default: `21`)
* **SFTP_USR:** SFTP users. (default: `anonymous`)
* **SFTP_PWD:** SFTP password. (default: no password)
* **SFTP_ROOT_DIR:** SFTP root directory. (default: no default directory)

Or you can pass connection configuration parameter to the method, this is example config parameter:

```js
const config = {
    host: '127.0.0.1',
    port: '2222',
    username: 'anonymous',
    password: 'anonymous',
    root_dir: ''
}
```

## Usage

Below is an example upload using method `POST` and headers `Content-Type: multipart/form-data`. In this example using `express` framework, so requires package `express-fileupload` and add this line in `app.js/index.js`.

```js
const fileupload = require('express-fileupload')
app.use(fileupload())
```

then the following module will work fine. 

```js
const { uploadstream } = require('mysftp')

router.post('/upload', async (req, res) => {
    // FILENAME is key from form-data, replace with yours
    let buffer = req.files.FILENAME.data 
    let filename = req.files.FILENAME.name 
    let remoteFile = '/test/' + filename

    // upload to SFTP
    let retval = await uploadstream(buffer, remoteFile) // parameters avaliable: buffer, remoteFile, config
    console.log(retval)
    res.send(retval.message) // retval.message will be "Upload successful" if no error
})
```
Below is an example multiple file upload using method `POST` and headers `Content-Type: multipart/form-data`. In this example using `express` framework, so requires package `express-fileupload` and add this line in `app.js/index.js`.

```js
const fileupload = require('express-fileupload')
app.use(fileupload())
```

then the following module will work fine. 

```js
const { multiuploadstream } = require('mysftp')

router.post('/upload', async (req, res) => {
    let files = Object.values(req.files)        
    let arrBuffer = []
    let arrRemoteFile = []

    files.forEach((element) => {
        arrBuffer.push(element.data)
        arrRemoteFile.push('/test/' + element.name)
    })

    // upload to SFTP
    let retval = await multiuploadstream(arrBuffer, arrRemoteFile) // parameters avaliable: arrBuffer, arrRemotefile, config
    console.log(retval)
    res.send(retval) // retval is an array

    // [
    //     { index: 0, message: 'Upload successful' },
    //     { index: 1, message: 'Upload successful' }
    // ]   
})
```

Below is an example download file from SFTP server to local directory.

```js
const { downloadfile } = require('mysftp')

let localFile = './temp/test.txt'
let remoteFile = '/test.txt'
let retval = downloadfile(localFile, remoteFile) // parameters avaliable: localFile, remoteFile, isFast, config
console.log(retval.message) // retval.message will be "Download successful" if no error
```

You can use concurrency download file. Pass `true` parameter after `remoteFile` parameter to tweaking of the fast download process.

```js
let retval = downloadfile(localFile, remoteFile, true) 
```

Below is an example upload file from local directory to SFTP server.

```js
const { uploadfile } = require('mysftp')

let localFile = './temp/test.txt'
let remoteFile = '/test.txt'
let retval = uploadfile(localFile, remoteFile) // parameter avaliable: localFile, remoteFile, isFast, config
console.log(retval.message) // retval.message will be "Upload successful" if no error
```

You can use concurrency upload file. Pass `true` parameter after `remoteFile` parameter to tweaking of the fast upload process.

```js
let retval = uploadfile(localFile, remoteFile, true) 
```

Below is an example of getting a list of directories on the SFTP server.

```js
let retval = await list('/')
console.log(retval)
```

If you find this useful, please ⭐ the repository. Any feedback is welcome. 

You can contribute or you want to, feel free to [__Buy me a coffee! :coffee:__](https://saweria.co/thesuhu), I will be really thankfull for anything even if it is a coffee or just a kind comment towards my work, because that helps me a lot.

## License

[MIT](https://github.com/thesuhu/mysftp/blob/master/LICENSE)