// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
          integrity:
            "sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi",
          crossorigin: "anonymous",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js",
          integrity:
            "sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3",
          crossorigin: "anonymous",
        },
      ],
    },
  },
  imports: {
    dirs: ["store"],
  },
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
  plugins: [{ src: "~/plugins/mqtt.client" }, { src: "~/plugins/eventbus.ts" }],
  runtimeConfig: {
    public: {
      BASE_URL: "$BASE_URL",
      BITU_BACKEND_URL: "$BITU_BACKEND_URL",
      MQTT_HOST: 'localhost' || "$MQTT_HOST",
      MQTT_PORT: '8083' || "$MQTT_PORT",
    },
  },
  build: {
    transpile: [/@esotericsoftware/]
  }
});
