import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { env } from "process";


// Transporter SMTP 
const transporter = nodemailer.createTransport({
  //service: "Cpanel",
  host: "mail.bleitravel.com",
  port: 465,
  secure: true,
/*  tls: {
    ciphers:'SSLv3'
 },*/
  auth: {
    //type: "OAuth2",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}); 

/** Funcion reusable SENDMAIL
@params {object} options - mail options (to, subject, text, html)
@params {function} callback - callback function to handle response
*/

const SENDMAIL = async (mailDetails, callback) => {
    try {
      const info = await transporter.sendMail(mailDetails)
      callback(info);
    } catch (error) {
      console.log(error);
    } 
  };

export default SENDMAIL;
