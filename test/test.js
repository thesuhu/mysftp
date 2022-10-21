// let { list, uploadfile } = require('../mysftp')

console.log('Hello world!')

// example with default configuration:

// // list dir
// list('/uploads').then((data) => {
//     console.log(data);
// })

// upload file 
// uploadfile('G:/Temp/sample.pdf', '/uploads/pdf/sample.pdf').then((data) => {
//     console.log(data)
// })

// upload file fast
// uploadfile('G:/Temp/sample.pdf', '/uploads/sample_fast.pdf', true).then((data) => {
//     console.log(data)
// })

// example with custom configuration:

// const config = {
//     host: '127.0.0.1',
//     port: '2222',
//     username: 'anonymous',
//     password: 'anonymous',
//     root_dir: ''
// }

// // upload file fast
// uploadfile('G:/Temp/sample.pdf', '/uploads/sample_fast.pdf', true, config).then((data) => {
//     console.log(data)
// })
