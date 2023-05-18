<template>
  <iframe
    id="iframe-whiteboard"
    src="http://localhost:3001"
    :style="{ width: '100%', height: '100%' }"
  ></iframe>
</template>

<script>
import { sendEventToIframe } from "~~/utils/iframe.helper";

export default {
  created() {
    // do something
    window.addEventListener("message", (ev) => {
      if (ev) {
        this.loadVocabIntoWhiteboard();
      }
    });
  },

  methods: {
    loadVocabIntoWhiteboard() {
      const data = [
        {
          question: "Do you always do the same thing in the morning?",
          answer: "My name is Khanh",
        },
        {
          question: "What is something you always do in the morning?",
          answer: "",
        },
        {
          question: "How do you usually feel in the morning?",
          answer: "",
        },
        {
          question: "What would you perfect morning be like?",
          answer: "",
        },
      ];
      sendEventToIframe("#iframe-whiteboard", "load-vocab", data);
    },
  },
};
</script>

<style></style>
