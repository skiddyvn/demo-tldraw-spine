<template>
  <div class="b-room-stage">
    <div class="b-room-stage-inner">
      <VocabCard v-if="isOpenModal" @close="isOpenModal = false"></VocabCard>
      <div class="card-stage flex-fill">
        <h3 class="b-room-stage-header text-light">
          When did you start practicing your hobby
        </h3>
        <!-- <div>
          User ID = {{ userId }}
          <button class="btn btn-primary" @click="ping">Ping</button>
        </div> -->
        <div
          class="card-stage-content"
          :class="{
            'stage-fullscreen': isFullscreen,
            'stage-minimized': !isFullscreen,
          }"
        >
          <!-- <KeepAlive> -->
          <component
            :is="components[tab]"
            @expand="onExpand"
            @clickSpine="onClickSpine"
          ></component>
          <!-- </KeepAlive> -->
        </div>
        <ul class="nav nav-pills mt-3">
          <li class="nav-item" @click="onChangeTab(0)">
            <a
              class="nav-link"
              :class="{ active: tab === 0 }"
              aria-current="page"
              href="#"
            >
              Grammar
            </a>
          </li>
          <li class="nav-item" @click="onChangeTab(1)">
            <a class="nav-link" :class="{ active: tab === 1 }" href="#">
              Vocab
            </a>
          </li>
          <li class="nav-item" @click="onChangeTab(2)">
            <a class="nav-link" :class="{ active: tab === 2 }" href="#">
              Tank
            </a>
          </li>
        </ul>
      </div>
      <div class="card-camera">
        <img src="~/assets/images/camera.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMqttStore } from "~/store/mqtt.store";
import type { Ref } from "vue";
import { defineAsyncComponent } from "vue";
import { getUser } from "~~/utils/helper";

const credential = ref(null);
const { data: res } = await useFetch("http://localhost:3002/rooms/test", {
  method: "POST",
  body: { userId: 1 },
});

const mqttStore = useMqttStore();

const mqttService = useMqttService();

let logs: Ref<string[]> = ref([]);
let users = ref([]);
let userId = ref("");
let tab = ref(0);
const isFullscreen = ref(false);

let isOpenModal = ref(false);

const components = [
  defineAsyncComponent(() => import("~/components/Grammar.vue")),
  defineAsyncComponent(() => import("~/components/Vocab.vue")),
  defineAsyncComponent(() => import("~/components/Tank.vue")),
];

const { $mqtt, $bus } = useNuxtApp();

watch(
  () => mqttStore.isMqttConnected,
  async (val) => {
    if (val) {
      mqttService.login({ userId: getUser() });
      await mqttService.subscribeRoom();
    }
  }
);

onMounted(() => {
  userId.value = getUser();

  $bus.$on("login", (m: any) => {
    console.log(m);
  });
  $bus.$on("ping", (m: any) => {
    alert(m.text);
  });
  $bus.$on("changeTab", (m: any) => {
    tab.value = m.tab;
  });
  $bus.$on("openVocabCard", (m: any) => {
    openCard();
  });
});

function ping() {
  mqttService.ping({
    text: `User ${userId.value} send Hello world`,
  });
}

function onChangeTab(tabIndex: number) {
  if (tab.value === tabIndex) return;
  tab.value = tabIndex;
  mqttService.changeRoomTab({
    tab: tabIndex,
  });
}

function onExpand(isExpand: boolean) {
  isFullscreen.value = isExpand;
}

function onClickSpine(d: any) {
  if (d.target === "rock") {
    mqttService.openVocabCard({});
    openCard();
  }
}

function openCard() {
  isOpenModal.value = true;
}
</script>

<style lang="scss">
.b-room-stage {
  background: rgba(255, 139, 3, 1);
  margin: 0 auto;
  padding: 16px;
  border-radius: 15px;
  max-width: 90%;

  .b-room-stage-inner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .b-room-stage-header {
    margin-bottom: 32px;
  }

  .nav-link {
    text-decoration: none;
    color: #fff;
  }

  .card-stage {
    padding: 16px;
    display: grid;
    grid-template-rows: min-content min-content auto min-content;

    .card-stage-content {
      border-radius: 32px;
      background-color: #fff;
      min-height: 640px;

      &.stage-fullscreen {
        position: initial;
      }

      &.stage-minimized {
        position: relative;
      }
    }
  }

  .card-camera {
    width: 400px;
    height: 600px;
    padding: 16px;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      height: 100%;
    }
  }
}
</style>
