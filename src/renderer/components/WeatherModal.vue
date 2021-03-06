<template>
  <div>
    <connection-modal></connection-modal>

    <modal
      classes="bg-grey-darkest rounded-lg shadow-2xl"
      :clickToClose="false"
      height="auto"
      name="weather-modal"
    >
      <div class="modal w-full h-full p-10 flex items-start justify-center">
        <div
          class="modal-close cursor-pointer"
          @click="hideModal"
          v-if="this.getLocationInfo != ''"
        >
          <span class="close-button topright text-2xl cursor-pointer">&times;</span>
        </div>
        <form class="w-full clickable" @submit.prevent="getWeatherData">
          <div class="flex items-center border-none py-2">
            <vue-google-autocomplete
              id="map"
              class="clickable font-semibold appearance-none bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none"
              placeholder="Search Location"
              types="geocode"
              v-on:focus="googleAutoCompleteFocused"
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
  </div>
</template>

<script>
import VueGoogleAutocomplete from "vue-google-autocomplete/src/VueGoogleAutocomplete";
import { mapActions, mapGetters } from "vuex";
import api from "../helpers/api";
import ConnectionModal from "./ConnectionModal";

export default {
  name: "WeatherModal",
  components: {
    VueGoogleAutocomplete,
    ConnectionModal
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
    if (
      this.getUserCurrentLocation.lat != 0 &&
      this.getUserCurrentLocation.lng != 0
    )
      this.setLocation();
    if (
      this.getUserCurrentLocation.lat != 0 &&
      this.getUserCurrentLocation.lng != 0
    )
      this.getWeatherData();
  },
  watch: {
    async getNow(val) {
      this.now = val;
      if (
        this.getUserCurrentLocation.lat != 0 &&
        this.getUserCurrentLocation.lng != 0
      )
        await this.getWeatherData();
      if (
        this.getUserCurrentLocation.lat != 0 &&
        this.getUserCurrentLocation.lng != 0
      )
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
      getUserCurrentLocation: "weather/getUserCurrentLocation",
      getReactiveCurrentWeatherForecast:
        "weather/getReactiveCurrentWeatherForecast",
      getNow: "weather/getNow",
      getLocationInfo: "weather/getLocationInfo"
    })
  },
  methods: {
    ...mapActions({
      setCoordinates: "weather/setCoordinates",
      setAddress: "weather/setAddress",
      weatherInformation: "weather/weatherInformation",
      setWeatherDetail: "weather/setWeatherDetail",
      setTodaySelectedWeatherDetail_Action:
        "weather/setTodaySelectedWeatherDetail_Action",
      setGraphOptions: "weather/setGraphOptions"
    }),
    googleAutoCompleteFocused() {
      api
        .isConnected()
        .catch(err => {
          console.log(err)
          this.$modal.hide("weather-modal");
          this.$modal.show("connection-modal");
        });
    },
    hideModal() {
      this.$modal.hide("weather-modal");
    },
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
    getWeatherData() {
      const apiPath = api.setupWeatherURLByCoordinates(this.lat, this.lng);
      var that = this;
      this.isLoading = true;
      api
        .isConnected()
        .then(function() {
          that
            .weatherInformation({
              apiPath: apiPath
            })
            .then(async response => {
              var todaysWeather = [];
              var weatherForTheNextDays = [];
              that.isLoading = false;
              await that.setAddress(that.address);
              await api
                .getWeatherForTheNextDays(response.data.list)
                .then(response => {
                  weatherForTheNextDays = response;
                });
              await api
                .getWeatherForToday(response.data.list)
                .then(response => {
                  todaysWeather = response;
                });
              await that.graphDataDismantling(todaysWeather);
              await that.setWeatherDetailAction(
                todaysWeather,
                weatherForTheNextDays
              );
              that.$modal.hide("weather-modal");
              that.disabled = true;
            })
            .catch(err => {
              that.isLoading = false;
              that.disabled = false;
            });
        })
        .catch(err => {
          that.isLoading = false;
          this.$modal.show("connection-modal");
        });
    }
  }
};
</script>

<style>
</style>