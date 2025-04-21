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