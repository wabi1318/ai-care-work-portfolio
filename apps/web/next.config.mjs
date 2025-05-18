import path from "path"; // path モジュールをインポート

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // html2canvas のエイリアスを html2canvas-pro に設定
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: path.resolve(
        __dirname,
        "../../node_modules/html2canvas-pro"
      ),
    };
    return config;
  },
  experimental: {
    // TurboPack を使用している場合、resolveAlias も設定することが推奨されます
    // (現状の package.json や turbo.json の設定からは TurboPack を使用しているかは不明瞭なためコメントアウト)
    // turbo: {
    //   resolveAlias: {
    //     html2canvas: "html2canvas-pro",
    //   },
    // },
  },
};

export default nextConfig;
