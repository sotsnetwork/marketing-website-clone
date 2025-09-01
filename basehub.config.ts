import { setGlobalConfig } from "basehub";

// Check if we have a BASEHUB_TOKEN
const hasToken = process.env.BASEHUB_TOKEN;

if (hasToken) {
  // If token exists, use normal configuration
  const _vercel_url_env = "VERCEL_URL";
  let v0Id = process.env[_vercel_url_env];
  if (v0Id && v0Id.includes("vusercontent")) {
    v0Id = v0Id.split(".")[0];
  }

  const playgroundId = v0Id 
    ? `${encodeURIComponent(v0Id)}__rel_v0`
    : "__dev__rel_v0";

  setGlobalConfig({
    fallbackPlayground: {
      target: "basehub/marketing-website", 
      id: playgroundId
    },
  });
} else {
  // For development without token, use demo playground
  setGlobalConfig({
    fallbackPlayground: {
      target: "basehub/marketing-website",
      id: "demo__rel_v0"
    },
  });
}
