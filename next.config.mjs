import { env } from "./src/server/env.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: false,
  images: {
    domains: ["sun-and-done.s3.us-west-1.amazonaws.com", "images.unsplash.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                "preset-default",
                "prefixIds",
                "removeDimensions",
                {
                  name: "sortAttrs",
                  params: {
                    xmlnsOrder: "alphabetical",
                  },
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [
                      {
                        preserveAspectRatio: "xMidYMid meet",
                      },
                    ],
                  },
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
});
