interface YelloLogo {
   href: string;
   src: string;
}

interface FrontendData {
   domain: string;
   logo: YelloLogo;
   accountActivationPaths: {
      editor: string;
   }
}

const domain: string = String(process.env.FRONTEND_DOMAIN);

export const frontendData: FrontendData = {
   domain: domain,
   logo: { href: domain, src: domain + "/" + String(process.env.FRONTEND_LOGO_PATH) },
   accountActivationPaths: { editor: domain + "/" + String(process.env.FRONTEND_EDITOR_REGISTRATION_PATH) }
}