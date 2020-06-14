<template>
  <div id="app" class="flex min-h-screen">
    <component :is="layout"></component>
  </div>
</template>

<script>
const default_layout = "default";
export default {
  name: "BreezeApp",
  mounted() {
    // this.$store.dispatch("updateNetwork");
    this.$store.dispatch("updateTime");
    this.$store.dispatch("updateExactlyNow");
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    }
  }
};
</script>

<style src="./assets/main.css"></style>

