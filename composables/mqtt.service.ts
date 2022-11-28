class MqttService {
  $mqtt: any = null;

  constructor($mqtt: any) {
    if (!this.$mqtt) {
      this.$mqtt = $mqtt;
    }
  }

  async isConnected() {
    return await this.$mqtt?.isConnected();
  }

  async subscribeRoom() {
    this.$mqtt.subscribe(`room/test/#`, {
      qos: 1,
    });
  }

  async unsubscribeRoom() {
    if (!(await this.isConnected())) return;

    this.$mqtt.unsubscribe(`room/test/#`, {});
  }

  sendMqttMessage(endpoint: string, data: any) {
    this.$mqtt.send(endpoint, JSON.stringify(data), 0, false);
  }

  ping(data: any) {
    this.sendMqttMessage("room/test/ping", data);
  }

  login(data: any) {
    this.sendMqttMessage("room/test/login", data);
  }

  changeRoomTab(data: any) {
    this.sendMqttMessage("room/test/changeTab", data);
  }

  openVocabCard(data: any) {
    this.sendMqttMessage("room/test/openVocabCard", data);
  }
}

export function useMqttService() {
  const { $mqtt } = useNuxtApp();
  return new MqttService($mqtt);
}
