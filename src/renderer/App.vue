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
    this.$store.dispatch("weather/updateTime");
    this.$store.dispatch("weather/updateExactlyNow");
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    }
  },
};
</script>

<style src="./assets/main.css"></style>

