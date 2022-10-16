let { list, uploadFile } = require('../mysftp')

// example with default configuration:

// // list dir
// list('/uploads').then((data) => {
//     console.log(data);
// })

// upload file 
// uploadFile('G:/Temp/sample.pdf', '/uploads/pdf/sample.pdf').then((data) => {
//     console.log(data)
// })

// // upload file fast
// uploadFile('G:/Temp/sample.pdf', '/uploads/sample_fast.pdf', true).then((data) => {
//     console.log(data)
// })

// example with custom configuration:
