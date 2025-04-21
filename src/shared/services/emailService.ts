import transporter, { emailContactUsername, emailErrorUsername, emailUsername } from "../config/email.config.js";
import { IError } from "../store/store.interface.js";
import { errorEmailTemplate } from "../templates/email/errorEmailTemplate.js";
import { contactEmailTemplate } from "../templates/email/contactEmailTemplate.js";
import { registrationEmailTemplate } from "../templates/email/registrationEmailTemplate.js";
import { passwordResetEmailTemplate } from "../templates/email/passwordResetEmailTemplate.js";

interface EmailOptions {
   to: string;
   subject: string;
   text?: string;
   html?: string;
}

export interface ContactData {
   name: string;
   email: string;
   message: string;
}

export interface RegistrationData {
   emailTo: string;
   code: string;
}

class EmailService {
   private fromUsername: string = `"Agencja Yello" <${emailUsername}>`;
   private toErrorUsername: string = emailErrorUsername;
   private toContactUsername: string = emailContactUsername;

   private async sendEmail(options: EmailOptions): Promise<void> {
      try {
         const mail = await transporter.sendMail({
            from: this.fromUsername,
            ...options
         });
      } catch (error) {
         console.error("Błąd podczas wysyłania maila: " + error);
      }
   }

   async sendErrorEmail(errors: IError[], to: string = this.toErrorUsername): Promise<void> {
      await this.sendEmail({
         to,
         subject: "Błąd serwera",
         html: errorEmailTemplate(errors)
      });
   }

   async sendContactFormEmail(contactData: ContactData, to: string = this.toContactUsername): Promise<void> {
      await this.sendEmail({
         to,
         subject: `Wiadomość z formularza kontaktowego od ${contactData.name}`,
         html: contactEmailTemplate(contactData)
      })
   }

   async sendRegistrationEmail(registrationData: RegistrationData): Promise<void> {
      await this.sendEmail({
         to: registrationData.emailTo,
         subject: `Aktywuj swoje konto redaktora yello`,
         html: registrationEmailTemplate(registrationData.code)
      })
   }

   async sendPasswordResetEmail(emailTo: string, code: string): Promise<void> {
      await this.sendEmail({
         to: emailTo,
         subject: "Przypomnienie hasła redaktora yello",
         html: passwordResetEmailTemplate(code)
      })
   }
}

export default EmailService;