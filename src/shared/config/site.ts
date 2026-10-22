const developmentSiteUrl = 'http://localhost:3000';


function getSiteUrl(): string {
  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  const value =
    process.env.SITE_URL ||
    (vercelUrl ? `https://${vercelUrl}` : undefined) ||
    process.env.URL ||
    developmentSiteUrl;

  return new URL(value).origin;
}

export const siteUrl = getSiteUrl();
export const isProduction = process.env.NODE_ENV === 'production';
