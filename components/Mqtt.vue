<template></template>

<script setup lang="ts">
import { useMqttStore } from "~/store/mqtt.store";
import { getUser } from "~~/utils/helper";

const mqttStore = useMqttStore();

const { $mqtt, $bus } = useNuxtApp();

onMounted(async () => {
  await createConnection();
});

async function createConnection() {
  if (!(await $mqtt.isConnected())) {
    $mqtt.onConnectionLost = onConnectionLost;
    $mqtt.onMessageArrived = onMessageArrived;
    const dataConnect = {
      userName: `user_${getUser()}`,
      //   password: `${auth.refresh_token}`,
      reconnect: true,
      onSuccess: onConnect,
      onFailure: onConnectFailure,
      cleanSession: false,
    };
    await $mqtt.connect(dataConnect);
  }
}

function onMessageArrived(message: any) {
  try {
    const regexRoom = /room\/(.*?)\/(.*?)$/gm;
    const regexTopic = regexRoom.exec(message.topic);
    if (regexTopic && regexTopic.length === 3) {
      const messageJson = JSON.parse(message.payloadString);
      const topicKey = regexTopic[2];
      console.log(`New message from ${topicKey}`)
      $bus.$emit(topicKey, messageJson);
    }
  } catch (e) {
    console.log("[MQTT] onMessageArrived:", e);
  }
}

function onConnect() {
  console.log('[MQTT] Connected')
  mqttStore.isMqttConnected = true;
}

function onConnectFailure(e: any) {
  console.log("[MQTT] onConnectFailure:", e);
}

function onConnectionLost(responseObject: any) {
  if (responseObject.errorCode !== 0) {
    console.log("[MQTT] onConnectionLost:" + responseObject.errorMessage);
  }
}
</script>

<style></style>
