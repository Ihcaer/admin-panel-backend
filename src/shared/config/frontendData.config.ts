type Logo = {
   href: string;
   src: string;
}

type FrontendData = {
   companyName: string;
   domain: string;
   logo: Logo;
   accountActivationPaths: {
      editor: string;
   }
   passwordReset: {
      editor: string;
   }
}

const domain: string = String(process.env.FRONTEND_DOMAIN);

export const frontendData: FrontendData = {
   companyName: String(process.env.COMPANY_NAME),
   domain: domain,
   logo: { href: domain, src: domain + "/" + String(process.env.FRONTEND_LOGO_PATH) },
   accountActivationPaths: { editor: domain + "/" + String(process.env.FRONTEND_EDITOR_REGISTRATION_PATH) },
   passwordReset: { editor: domain + "/" + String(process.env.FRONTEND_EDITOR_PASSWORD_RESET_PATH) }
}