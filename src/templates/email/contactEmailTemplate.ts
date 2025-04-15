import { ContactData } from "../../services/emailService.js";
import { emailCommonStyles as commonStyles, getEmailTemplate } from "./emailCommon.js";

export const contactEmailTemplate = (contactData: ContactData): string => {
   const template: string = `
      <h1 ${commonStyles.h1}>Nowe zgłoszenie z formularza</h1>
      <p ${commonStyles.p}>Nowa wiadomość wysłana przez formularz:</p>
      <table ${commonStyles.contentTable}>
         <tr ${commonStyles.contentTr}>
            <td ${commonStyles.contentTd}>Imię: ${contactData.name}<br/>E-mail: ${contactData.email}<br/><br/>Wiadomość:<br/>${contactData.message}</td>
         </tr>
      </table>
   `;
   const email: string = getEmailTemplate(template);

   return email;
};