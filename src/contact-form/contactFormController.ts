import { Request, Response, NextFunction } from "express";
import EmailService, { ContactData } from "../shared/services/emailService.js";

class ContactFormController {
   constructor(private emailService: EmailService) { }

   async sendForm(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
         const contactData: ContactData = req.body;

         if (!contactData.name || !contactData.email || !contactData.message) {
            res.status(400).json({ status: "error", message: "Proszę wypełnić wszystkie pola formularza." });
            return;
         }

         await this.emailService.sendContactFormEmail(contactData);

         res.status(200);
      } catch (error) {
         next(error);
      }
   }
}

export default ContactFormController;