import { frontendData } from "../../config/frontendData.config.js";
import { getEmailTemplate } from "./emailCommons.js";
import { emailCommonStyles as commonStyles } from "./emailCommonStyles.js";

export const registrationEmailTemplate = (code: string): string => {
   const accountActivationPath: string = frontendData.passwordReset.editor;
   const template: string = `
      <h1 ${commonStyles.h1}>Aktywacja konta redaktora</h1>
      <p ${commonStyles.p}>Aktywuj konto klikając <a href="https://${accountActivationPath}/${code}" target="_blank">tutaj</a>.</p>
      <p>Jeżeli powyższy odnośnik nie działa kliknij w link poniżej ↓</p>
      <table ${commonStyles.contentTable}>
         <tr ${commonStyles.contentTr}>
            <td ${commonStyles.contentTd}>
               <a href="https://${accountActivationPath}/${code}" target="_blank">https://${accountActivationPath}/${code}</a>
            </td>
         </tr>
      </table>
      <p ${commonStyles.p}>Link wygasa po 24 godzinach. Jeżeli nie jesteś odbiorcą wiadomości możesz ją zignorować.</p>
   `;
   const email: string = getEmailTemplate(template);
   return email;
}