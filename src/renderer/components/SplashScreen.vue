<template>
  <div
    class="bg-gray-darkest clickable p-1 flex-wrap fixed min-h-screen min-w-full w-full h-full flex content-between"
  >
    <div class="flex justify-between w-full">
      <ul class="flex justify-end">
        <li>
          <!-- <img src="" alt="Xskript Logo" class="px-5 py-2 text-white"> -->
        </li>
        <li>
          <p
            ref="close"
            class="text-white px-5 py-4 text-md"
            style="border-top-right-radius: 14px;"
          >xSkript</p>
        </li>
      </ul>
      <ul class="flex justify-end">
        <li>
          <div
            @click="windowState('minimize')"
            class="clickable text-white hover:bg-grey-light-op hover:text-white px-5 text-3xl"
          >-</div>
        </li>
        <li>
          <div
            @click="windowState('close')"
            class="clickable text-white hover:bg-red-light hover:text-white px-5 text-3xl"
            style="border-top-right-radius: 14px;"
          >&times;</div>
        </li>
      </ul>
    </div>
    <div class="w-full">
      <div class="flex justify-center">
        <h1 class="text-white text-6xl">BreezeApp</h1>
      </div>
      <div class="flex justify-center">
        <img src="../assets/svg-loaders/oval.svg" width="40" alt />
      </div>
    </div>

    <div class="flex justify-start p-4 items-end">
      <p class="text-white text-xs">Loading</p>
    </div>
  </div>
</template>

<script>
const { remote } = require("electron");
export default {
  methods: {
    windowState(state) {
      if (state == "close") remote.app.quit();
      else if (state == "minimize") remote.getCurrentWindow().minimize();
    }
  }
};
</script>

<style>
</style>