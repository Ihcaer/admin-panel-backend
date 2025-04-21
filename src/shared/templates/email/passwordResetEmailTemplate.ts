import { frontendData } from "../../config/frontendData.config.js";
import { getEmailTemplate } from "./emailCommons.js";
import { emailCommonStyles as commonStyles } from "./emailCommonStyles.js";

export const passwordResetEmailTemplate = (code: string): string => {
   const passwordResetPath: string = frontendData.passwordReset.editor;
   const template: string = `
      <h1 ${commonStyles.h1}>Przypomnienie hasła</h1>
      <p ${commonStyles.p}>Zresetuj hasło klikając <a href="https://${passwordResetPath}/${code}" target="_blank">tutaj</a>.</p>
      <p>Jeśli powyższy odnośnik nie działa kliknij w link poniżej ↓</p>
      <table ${commonStyles.contentTable}>
         <tr ${commonStyles.contentTr}>
            <td ${commonStyles.contentTd}>
               <a href="https://${passwordResetPath}/${code}" target="_blank">https://${passwordResetPath}/${code}</a>
            </td>
         </tr>
      </table>
      <p ${commonStyles.p}>Link wygasa po 10 minutach. Jeżeli nie jesteś odbiorcą wiadomości możesz ją zignorować.</p>
   `;
   const email: string = getEmailTemplate(template);
   return email;
}