import { frontendData } from "../../config/frontendData.config.js";

const getEmailCaption = (): string => {
   const currentYear: number = new Date().getFullYear();
   const companyName: string = frontendData.companyName;
   const caption = `Wiadomość wygenerowana automatycznie. Prosimy na nią nie odpowiadać.<br>&copy;${currentYear} ${companyName}`;
   return caption;
};

export const getEmailTemplate = (content: string): string => {
   const template: string = `
      <!DOCTYPE html>
      <html lang="pl">
         <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Server error</title>
         </head>
         <body style="margin: 0; color: #252525;">
            <table width="100%>
               <tr>
                  <table align="center" style="width: 100%; max-width: 600px; border-left: 6px solid #F5DF4D; padding: 10px 15px;">
                     
                     <tr>
                        <td align="center">
                           <a href="${frontendData.logo.href}"><img src="${frontendData.logo.src}"></a>
                        </td>
                     </tr>
                     <tr>
                        <td>
                           ${content}
                        </td>
                     </tr>
                     <caption style="caption-side: bottom; margin-top: 10px">${getEmailCaption()}</caption>
                  </table>
               </tr>
            </table>
         </body>
      </html>
   `;

   return template;
}