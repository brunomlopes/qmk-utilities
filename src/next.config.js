// @ts-check
const fs = require("fs");

module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    /* config options here */
    async headers() {
      return [
        {
          source: "/",
          headers: [
            {
              key: "X-Test-Build-Time-Header",
              value:
                "this-is-going-to-be-replaced-by-patch-headers-on-next-build",
            },
            {
              key: "Something",
              value: "other",
            },
          ],
        },
      ];
    },
  };
  return nextConfig;
};
