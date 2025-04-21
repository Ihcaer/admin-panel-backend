import { Router } from "express";
import EmailService from "../shared/services/emailService.js";
import ContactFormController from "./contactFormController.js";
import restMiddleware from "../shared/middleware/restMiddleware.js";

const contactFormRoutes: Router = Router();

const emailService: EmailService = new EmailService();
const contactFormController: ContactFormController = new ContactFormController(emailService);

contactFormRoutes.post('/send', restMiddleware, contactFormController.sendForm.bind(contactFormController));

export default contactFormRoutes;