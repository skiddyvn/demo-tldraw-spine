<template>
  <div
    id="spineBitu"
    :class="{ fullscreen: isFullscreen, minimized: !isFullscreen }"
  >
    <div class="section-overlay">
      <div class="d-flex justify-content-end px-3">
        <button class="btn btn-danger" @click="expand">
          {{ isFullscreen ? "Minimized" : "Expand" }}
        </button>
      </div>
    </div>
    <canvas id="bitu" :style="{ width: '100%', height: '100%' }"></canvas>
  </div>
</template>

<script setup lang="ts">
import { SpineCanvas } from "@esotericsoftware/spine-webgl";
import { Train } from '~~/libs/TrainHead';

let isFullscreen = ref(false);

const emit = defineEmits(["expand", "click-spine"]);

onMounted(() => {
  new SpineCanvas(document.getElementById("bitu"), {
    app: new Train({
      callback: (boneName: string) => {
        emit("click-spine", {
          target: boneName,
        });
      },
    }),
  });
});

function expand() {
    isFullscreen.value = !isFullscreen.value
    emit('expand', isFullscreen.value)
}
</script>

<style lang="scss">
#spineBitu {
  position: absolute;
  top: 0;
  left: 0;
  background-image: url('~/assets/spines/bg.png');
  background-size: cover;

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
