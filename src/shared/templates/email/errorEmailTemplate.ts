import { IError } from "../../store/store.interface.js";
import { getEmailTemplate } from "./emailCommons.js";
import { emailCommonStyles as commonStyles } from "./emailCommonStyles.js";

export const errorEmailTemplate = (errors: IError[]): string => {
   const errorTr: readonly string[] = errors.map(error =>
      `<tr ${commonStyles.contentTr}><td ${commonStyles.contentTd}>(${error.time.toLocaleString()})<br/>${error.message}</td></tr>`
   );

   const errorTemplate: string = `
      <h1 ${commonStyles.h1}>⚠️ Wystąpił błąd serwera!</h1>
      <p ${commonStyles.p}>Zarejestrowane błędy:</p>
      <table ${commonStyles.contentTable}>
         ${errorTr.join('')}
      </table>
      <p style="margin: 10px 0 0;">Skontaktuj się z developerem, aby rozwiązać podane problemy.</p>
   `;
   const email: string = getEmailTemplate(errorTemplate);

   return email;
};