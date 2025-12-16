export const extractS3KeyFromUrl = (url: string) => {
  try {
    const cloudFrontDomain = "https://d3fhc8hmbgwz4k.cloudfront.net/";

    if (!url.startsWith(cloudFrontDomain)) {
      console.warn(
        `⚠️ La URL no tiene dominio de CloudFront, se asume que ya es un key: ${url}`
      );
      return url;
    }

    return url.replace(cloudFrontDomain, "");
  } catch (error) {
    console.error("❌ Error al extraer la clave S3:", error);
    return null;
  }
};
