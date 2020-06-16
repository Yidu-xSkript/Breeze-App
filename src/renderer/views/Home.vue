<template>
  <div class="main">
    <div class="video-container">
      <video ref="videoRef" loop muted autoplay class="titlebar fullscreen-bg__video">
        <source src type="video/mp4" />
      </video>
      <div class="overlay"></div>
    </div>
    <div class="p-16 w-256 fixed min-h-screen flex content-between flex-wrap">
      <div class="grid grid-cols-1">
        <h3 class="font-semibold text-white z-10 text-lg">BreezeApp &copy;</h3>
      </div>
      <div class="min-w-full">
        <div class="grid grid-cols-1 flex justify-start">
          <img :src="iconURL" alt="ICON" class="object-contain h-20" />
        </div>
        <div class="grid grid-cols-3 flex items-stretch">
          <h1
            class="col-span-1 h-64 font-extrabold text-white text-12xl inline-block align-text-bottom p-0 m-0 self-end flex-1"
          >{{ Math.round(selectedWeather.main.temp) }}&#176;</h1>
          <div class="col-span-2 z-10 self-end flex-1">
            <p
              class="bg-white font-bold text-black w-48 p-2 text-xl rounded has-shadow"
            >{{ selectedWeather.weather[0].description }}</p>
            <p class="font-semibold text-white text-4xl">It's a {{ statement.dayStatus }}</p>
            <p class="font-light text-white text-2xl">{{ statement.motto }}</p>
          </div>
        </div>
        <div class="divider pt-16 z-10"></div>
        <div class="flex justify-between z-10 pt-12">
          <div>
            <span class="font-semibold text-sm text-white">{{ currentDate }}</span>
          </div>
          <div>
            <span class="font-semibold text-white text-base pr-4">{{ location }}</span>
            <button
              @click="showWeatherModal"
              class="clickable bg-transparent text-white font-semibold text-xs py-1 px-5 border border-gray-700 rounded hover:bg-white hover:text-black focus:outline-none hover:border-transparent"
            >Change</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "../helpers/api";
export default {
  name: "Home",
  data() {
    return {
      selectedWeather: {},
      iconURL: "",
      statement: {
        motto: "",
        video: "",
        dayStatus: ""
      },
      location: "",
      currentDate: ""
    };
  },
  computed: {
    ...mapGetters({
      getTodaySelectedWeatherDetail: "weather/getTodaySelectedWeatherDetail",
      getLocationInfo: "weather/getLocationInfo",
      getExactlyNow: "weather/getExactlyNow",
    })
  },
  watch: {
    getExactlyNow(val) {
      this.currentDate = api.convertDateAndTime(val);
    },
    getTodaySelectedWeatherDetail(val) {
      this.selectedWeather = val;
      this.iconURL = api.setupIconURL(val.weather[0].icon) + ".png";
      this.statement.motto = this._statement(val.weather[0]).motto;
      this.$nextTick(() => {
        this.$refs.videoRef.src = this._statement(val.weather[0]).video;
        this.$refs.videoRef.play();
      });
      this.statement.dayStatus = this._statement(
        val.weather[0].id,
        val.weather[0].icon
      ).dayStatus;
    },
    getLocationInfo(val) {
      this.location = val;
    }
  },
  created() {
    this.currentDate = api.convertDateAndTime();
    this.setSelectedWeather();
    this.setLocation();
  },
  methods: {
    setLocation() {
      this.location = this.getLocationInfo;
    },
    showWeatherModal() {
      this.$modal.show("weather-modal");
    },
    setIcon() {
      this.iconURL =
        api.setupIconURL(this.getTodaySelectedWeatherDetail.weather[0].icon) +
        ".png";
    },
    setVideo() {
      this.$nextTick(() => {
        this.$refs.videoRef.src = this._statement().video;
        this.$refs.videoRef.play();
      });
    },
    isEmpty(obj) {
      for (var key in obj) {
        if (this.hasOwnProperty(key)) return false;
      }
      return true;
    },
    _statement(val = {}) {
      return this.isEmpty(val)
        ? api.createStatement(
            this.getTodaySelectedWeatherDetail.weather[0].id,
            this.getTodaySelectedWeatherDetail.weather[0].icon
          )
        : api.createStatement(val.id, val.icon);
    },
    setSelectedWeather() {
      this.selectedWeather = this.getTodaySelectedWeatherDetail;
      this.setIcon();
      this.setVideo();
      this.statement.motto = this._statement().motto;
      this.statement.dayStatus = this._statement().dayStatus;
    }
  }
};
</script>
