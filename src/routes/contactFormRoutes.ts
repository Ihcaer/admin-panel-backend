import { Router } from "express";
import EmailService from "../services/emailService.js";
import ContactFormController from "../controllers/contactFormController.js";
import restMiddleware from "../middlewares/restMiddleware.js";

const contactFormRoutes: Router = Router();

const emailService: EmailService = new EmailService();
const contactFormController: ContactFormController = new ContactFormController(emailService);

contactFormRoutes.post('/send', restMiddleware, contactFormController.sendForm.bind(contactFormController));

export default contactFormRoutes;