<template>
  <div
    class="modal-vocab-card modal"
    tabindex="-1"
    role="dialog"
    style="display: block; z-index: 10003"
  >
    <div class="modal-dialog" role="document">
      <div class="flip-card">
        <div class="flip-card-inner" :class="{ 'do-flip': isCardFlipped }">
          <div class="flip-card-front">
            <div class="modal-content mx-auto">
              <div class="modal-header">
                <h5 class="modal-title">Vocabulary</h5>
                <button
                  type="button"
                  class="btn btn-light close"
                  data-dismiss="modal"
                  aria-label="Close"
                  @click="$emit('close')"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                class="modal-body d-flex align-items-center"
                @click="flipCard"
              >
                <img class="img-fluid" src="~/assets/images/cat.jpeg" alt="" />
              </div>
            </div>
          </div>
          <div class="flip-card-back">
            <div class="modal-content mx-auto">
              <div class="modal-header">
                <h5 class="modal-title">Vocabulary</h5>
                <button
                  type="button"
                  class="btn btn-light close"
                  data-dismiss="modal"
                  aria-label="Close"
                  @click="$emit('close')"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                class="modal-body d-flex align-items-center"
                @click="flipCard"
              >
                <div
                  class="d-flex flex-column align-items-center justify-content-center text-dark text-center"
                >
                  <h2 style="color: orange">
                    <strong>CAT (NOUN)</strong>
                  </h2>
                  <h4 style="margin-top: 4px">/cat/</h4>
                  <h4 style="margin-top: 32px">CON MÈO</h4>
                  <h4 style="margin-top: 32px">
                    I USUALLY KICK THE CAT WITH MY FEET.
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
let isCardFlipped = ref(false);
function flipCard(d: any) {
  isCardFlipped.value = !isCardFlipped.value;
}
</script>

<style lang="scss">
.modal-vocab-card {
  .modal-content {
    max-width: 320px;
    min-height: 540px;
  }
}
/* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
.flip-card {
  background-color: transparent;
  //   border: 1px solid #f1f1f1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.do-flip {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
}

/* Style the back side */
.flip-card-back {
  transform: rotateY(180deg);
}
</style>
