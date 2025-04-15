import { IError } from "../../store/store.interface.js";
import { emailCommonStyles as commonStyles, getEmailTemplate } from "./emailCommon.js";

const errorTdStyles: string = "border-left: 4px solid #F5DF4D; background-color: #fff3cd; padding: 5px 8px;";

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