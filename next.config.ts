import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER ?? "";
const isPagesBuild = process.env.GITHUB_ACTIONS === "true";
const isAccountSite = repositoryName === `${repositoryOwner}.github.io`;
const basePath =
  isPagesBuild && repositoryName && !isAccountSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
