const nodeMailer = require('nodemailer')
const config = require('../config')
console.log("Ddddd",config.HOST,config.PORT,config.HOST,config.USER,config.PASS)

module.exports = {
    mailOptions(to, subject, html) {
       
       
        return {
            from: `<${config.EMAL_SENDER}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html //html body
        }
    },
    transporter: nodeMailer.createTransport({
        // host: config.HOST,
        // port: config.PORT,
        // service: config.HOST,
        // // secure: true,

        // auth: {
        //     user: config.USER, // generated ethereal user
        //     pass: config.PASS, // generated ethereal password
        // },

        host: config.HOST,
        port: config.PORT,
        service: config.HOST,
        // secure: true,

        auth: {
            user: config.USER, // generated ethereal user
            pass: config.PASS, // generated ethereal password
        },
       










    }),
}



