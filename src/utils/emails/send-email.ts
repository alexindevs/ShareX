import nodemailer from 'nodemailer';
import logger from '../logging/logger';
import fs from "fs";
import path from "path";

const emailPass = process.env.EMAIL_PASS || "";

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        debug: true,
        logger: true,
        auth: {
            user: "alexindevs@gmail.com",
            pass: emailPass,
        },
        tls: {
            rejectUnauthorized: false
        }
      });
    
      const mailOptions = {
            from: 'alexindevs@gmail.com',
            to,
            subject,
            text: "",
            html: html || "",
      };
      const info = await transporter.sendMail(mailOptions);
      logger.info('Email sent:' + info.response);
    } catch (error) {
      logger.error('Error sending email:'+ error);
      throw new Error("Error sending email");
    }
}
  
export const processEmail = async function (emailType: string, templateData: object) {
    try {
      const filePath = path.join(__dirname, `${emailType}.html`);
      const content = readFileContent(filePath);
      if (!content) {
        logger.error("Error processing email: File content empty;");
        throw new Error("Error processing email");
      }
      const html = replacePlaceholders(content, templateData);
      return html;
    } catch (error) {
      throw new Error("Error processing email");
    }
  }
  
function readFileContent(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content;
    } catch (error: any) {
      logger.error(`Error reading file at path ${filePath}: ${error.message}`);
      throw new Error(`Error reading file at path ${filePath}: ${error.message}`);
    }
  }
  
 function replacePlaceholders(html: string, templateData: any) {
    return html.replace(/\{\{(\w+)\}\}/g, (match, p1) => {
      return templateData[p1] || match;
    });
  }