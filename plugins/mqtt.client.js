import { defineNuxtPlugin } from "#app";
import uuid from "uuid-random";
// const Paho = require("~/libs/pago-mqtt.js");
import PahoMQTT from "@/libs/paho-mqtt";
import { getUser } from "~~/utils/helper";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();

  getUser();

  nuxtApp.provide(
    "mqtt",
    new PahoMQTT.Client(
      runtimeConfig.MQTT_HOST,
      parseInt(runtimeConfig.MQTT_PORT),
      "/mqtt",
      "mqttjs_" + uuid()
    )
  );
});
