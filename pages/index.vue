<template>
  <div class="b-room position-relative">
    <Header></Header>
    <div class="b-room-stage-wrapper has-sidebar">
      <Room></Room>
    </div>
    <sidebar></sidebar>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.b-room {
  background-image: url("~/assets/images/bg-room.png");
  background-size: cover;
  background-position: 100% 100%;
  background-repeat: no-repeat;
  width: 100vw;
  height: 100vh;
}

.b-room-stage-wrapper {
  padding: 0 16px;

  &.has-sidebar {
    padding-left: 88px;
  }
}
</style>
