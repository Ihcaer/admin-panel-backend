import { frontendData } from "../../config/frontendData.config.js";

export interface CommonStyles {
   body: string;
   h1: string;
   p: string;
   externalTable: string;
   internalTable: string;
   caption: string;
   logoTd: string;
   contentTable: string;
   contentTr: string;
   contentTd: string;
}

const mainYellow: string = "#F5DF4D";

export const emailCommonStyles: CommonStyles = {
   body: `style="margin: 0; color: #252525;"`,
   h1: `style="margin: 10px 0 30px"`,
   p: `style="margin: 0"`,
   externalTable: `width="100%`,
   internalTable: `align="center" style="width: 100%; max-width: 600px; border-left: 6px solid ${mainYellow}; padding: 10px 15px;"`,
   caption: `style="caption-side: bottom; margin-top: 10px"`,
   logoTd: `align="center"`,
   contentTable: `width="100%" style="border-spacing: 0 7px;"`,
   contentTr: `style="margin-bottom: 5px"`,
   contentTd: `style="border-left: 4px solid ${mainYellow}; background-color: #fff3cd; padding: 5px 8px;"`
};

const getEmailCaption = (): string => {
   const currentYear: number = new Date().getFullYear();
   const caption = `Wiadomość wygenerowana automatycznie. Prosimy na nią nie odpowiadać.<br>&copy;${currentYear} Agencja Yello`;
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