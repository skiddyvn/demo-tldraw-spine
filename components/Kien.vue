<template>
  <div
    id="spineTank"
    :class="{ fullscreen: isFullscreen, minimized: !isFullscreen }"
  >
    <div class="section-overlay">
      <div class="d-flex justify-content-end px-3">
        <button class="btn btn-danger" @click="expand">
          {{ isFullscreen ? "Minimized" : "Expand" }}
        </button>
      </div>
    </div>
    <canvas id="kien" :style="{ width: '100%', height: '100%' }"></canvas>
  </div>
</template>

<script setup lang="ts">
import { SpineCanvas } from "@esotericsoftware/spine-webgl";
import { Kien } from "~~/libs/Kien";

let isFullscreen = ref(false);

const emit = defineEmits(["expand", "click-spine"]);

onMounted(() => {
  new SpineCanvas(document.getElementById("kien"), {
    app: new Kien({
      callback: () => {},
    }),
  });
});

function expand() {
  isFullscreen.value = !isFullscreen.value;
  emit("expand", isFullscreen.value);
}
</script>

<style lang="scss">
#spineTank {
  position: absolute;
  top: 0;
  left: 0;
  &.fullscreen {
    width: 100vw;
    height: 100vh;
    z-index: 9998;
  }

  &.minimized {
    width: 100%;
    height: 100%;
  }

  .section-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10000;
    padding: 16px 0;
  }
}
</style>
