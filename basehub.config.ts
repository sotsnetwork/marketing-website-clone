import { setGlobalConfig } from "basehub";

const _vercel_url_env = "VERCEL_URL";

let v0Id = process.env[_vercel_url_env];
if (v0Id && v0Id.includes("vusercontent")) {
  v0Id = v0Id.split(".")[0];
}

// For local development, use a default playground ID
const playgroundId = v0Id 
  ? `${encodeURIComponent(v0Id)}__rel_v0`
  : "__dev__rel_v0";

setGlobalConfig({
  fallbackPlayground: {
    target: "basehub/marketing-website", 
    id: playgroundId
  },
});
