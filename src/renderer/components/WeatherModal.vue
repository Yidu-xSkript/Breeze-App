<template>
  <modal classes="bg-grey-darkest rounded-lg shadow-2xl" height="auto" name="weather-modal">
    <div class="modal w-full h-full p-10 flex items-start justify-center">
      <form class="w-full clickable" @submit.prevent="getWeatherData">
        <div class="flex items-center border-b border-b-2 border-gray-800 py-2">
          <vue-google-autocomplete
            id="map"
            class="clickable font-semibold appearance-none bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none"
            placeholder="Search Place"
            types="geocode"
            v-on:placechanged="getAddressData"
          ></vue-google-autocomplete>
          <button
            class="clickable flex-shrink-0 text-black font-semibold text-xs py-1 px-5 border border-gray-700 rounded focus:outline-none"
            v-bind:class="{'opacity-50 cursor-not-allowed': disabled, 'bg-transparent': isLoading, 'bg-white': !isLoading}"
            type="submit"
            :disabled="disabled"
          >
            <span v-if="!isLoading">Select</span>
            <span v-else>
              <img src="../assets/svg-loaders/oval.svg" width="20" alt />
            </span>
          </button>
        </div>
      </form>
    </div>
  </modal>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete/src/VueGoogleAutocomplete";
import { mapActions, mapGetters } from "vuex";
import api from "../helpers/api";
export default {
  name: "WeatherModal",
  components: {
    VueGoogleAutocomplete
  },
  data() {
    return {
      address: "",
      lat: null,
      lng: null,
      disabled: true,
      isLoading: false,
      now: new Date()
    };
  },
  created() {
    this.setLocation();
  },
  watch: {
    async getNow(val) {
      this.now = val;
      await this.getWeatherData();
      this.getReactiveCurrentWeatherForecast;
    },
    getUserCurrentLocation(val) {
      this.lat = val.lat;
      this.lng = val.lng;
    },
    getReactiveCurrentWeatherForecast(val) {
      val.then(response => {
        this.setTodaySelectedWeatherDetail_Action(response);
      });
    },
    lat(val) {
      if (val == null) {
        this.disabled = true;
      }
    },
    lng(val) {
      if (val == null) {
        this.disabled = true;
      }
    }
  },
  computed: {
    ...mapGetters({
      getUserCurrentLocation: "getUserCurrentLocation",
      getReactiveCurrentWeatherForecast: "getReactiveCurrentWeatherForecast",
      getNow: "getNow",
      getLocationInfo: "getLocationInfo"
    })
  },
  methods: {
    ...mapActions({
      setCoordinates: "setCoordinates",
      setAddress: "setAddress",
      weatherInformation: "weatherInformation",
      setWeatherDetail: "setWeatherDetail",
      setTodaySelectedWeatherDetail_Action:
        "setTodaySelectedWeatherDetail_Action",
      setGraphOptions: "setGraphOptions"
    }),
    setLocation() {
      this.lat = this.getUserCurrentLocation.lat;
      this.lng = this.getUserCurrentLocation.lng;
      this.address = this.getLocationInfo;
    },
    async getAddressData(addressData, location) {
      this.address = location.formatted_address;
      console.log(location);
      await this.setCoordinates({
        lat: addressData.latitude,
        lng: addressData.longitude
      });
      this.disabled = false;
    },
    async graphDataDismantling(data) {
      var _graphLabels = [];
      var _graphDatasets = [];
      data.forEach(weather => {
        _graphLabels.push(api.convertTimeForLabel(weather.dt_txt));
        _graphDatasets.push(weather.main.temp);
      });
      this.setGraphOptions({
        graphLabels: _graphLabels,
        graphDatasets: _graphDatasets
      });
    },
    async setWeatherDetailAction(_todaysWeather, _weatherForTheNextDays) {
      await this.setWeatherDetail({
        todaysWeather: _todaysWeather,
        weatherForTheNextDays: _weatherForTheNextDays
      });
    },
    async getWeatherData() {
      console.log('new')
      this.isLoading = true;
      const apiPath = api.setupWeatherURLByCoordinates(this.lat, this.lng);
      await this.weatherInformation({
        apiPath: apiPath
      })
        .then(async response => {
          var todaysWeather = [];
          var weatherForTheNextDays = [];
          this.isLoading = false;
          await this.setAddress(this.address);
          await api
            .getWeatherForTheNextDays(response.data.list)
            .then(response => {
              weatherForTheNextDays = response;
            });
          await api.getWeatherForToday(response.data.list).then(response => {
            todaysWeather = response;
          });
          await this.graphDataDismantling(todaysWeather);
          await this.setWeatherDetailAction(
            todaysWeather,
            weatherForTheNextDays
          );
          this.$modal.hide("weather-modal");
          this.disabled = true;
        })
        .catch(err => {
          this.disabled = false;
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>