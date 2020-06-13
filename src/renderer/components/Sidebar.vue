<template>
  <div
    class="navigation bg-grey-darkest w-128 border-white text-white fixed min-h-screen inset-y-0 right-0 pt-8"
  >
    <weather-modal></weather-modal>
    <div class="header pl-8 pr-8 pb-8">
      <div class="flex justify-between">
        <div>
          <span class="text-gray-500">Location</span> |
          <span
            class="font-semibold text-base"
          >{{ userCurrentSelectedLocation }}</span>
        </div>
        <div>
          <button
            @click="showWeatherModal"
            class="clickable bg-transparent text-white font-semibold text-xs py-1 px-5 border border-gray-700 rounded hover:bg-white hover:text-black focus:outline-none hover:border-transparent"
          >Change</button>
        </div>
      </div>
    </div>
    <perfect-scrollbar class="clickable">
      <div class="information-booth pl-8 pr-8 pb-8 pt-8">
        <div class="grid grid-cols-1 pb-5">
          <h3 class="font-semibold">Weather Details</h3>
        </div>
        <div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Clouds</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ getTodaySelectedWeatherDetail.clouds.all }}</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Temperature Perception</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ getTodaySelectedWeatherDetail.main.feels_like }}&#8451;</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Humidity</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ getTodaySelectedWeatherDetail.main.humidity }} %</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Wind</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ convertSpeed(getTodaySelectedWeatherDetail.wind.speed) }} km/h</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Minimum Temperature</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ Math.round(getTodaySelectedWeatherDetail.main.temp_min) }}&#8451;</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Maximum Temperature</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ Math.round(getTodaySelectedWeatherDetail.main.temp_max) }}&#8451;</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Atmospheric Pressure | Sea Level</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ getTodaySelectedWeatherDetail.main.sea_level }} hPa</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
          <div class="flex justify-between pb-2">
            <div class="text-gray-600 font-semibold text-sm">Atmospheric Pressure | Ground Level</div>
            <div
              class="font-semibold text-sm"
              v-if="getTodaySelectedWeatherDetail"
            >{{ getTodaySelectedWeatherDetail.main.grnd_level }} hPa</div>
            <div class="font-semibold text-sm" v-else>Unknown</div>
          </div>
        </div>
      </div>
      <div class="information-booth pl-0 pr-0 pb-8 pt-8 no-p" v-if="graphDatasets.length > 1">
        <div class="grid grid-cols-1 pb-5 pl-8 pr-8">
          <h3 class="font-semibold">Temperature</h3>
        </div>
        <div class="chartjs-data">
          <line-chart :chart-data="datacollection" :options="chartOptions"></line-chart>
        </div>
      </div>
      <div class="information-booth pl-8 pr-8 pb-8 pt-8">
        <div class="grid grid-cols-1 pb-5">
          <h3 class="font-semibold">Next Days</h3>
        </div>
        <div>
          <div
            class="flex justify-between pb-2"
            v-for="(weather, index) in nextDaysWeatherDetail"
            :key="index"
          >
            <div class="text-gray-600 font-semibold text-sm">{{ index }}</div>
            <div class="font-semibold text-sm">{{ weather[0].main.temp }} &#8451;</div>
          </div>
        </div>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import LineChart from "../helpers/LineChart";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import WeatherModal from "./WeatherModal.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    LineChart,
    PerfectScrollbar,
    WeatherModal
  },
  data() {
    return {
      todaysWeatherDetail: [],
      nextDaysWeatherDetail: {},
      userCurrentSelectedLocation: {},
      todaysSelectedWeatherDetail: {},
      datacollection: {},
      // to be continued tmrw
      graphLabels: [],
      graphDatasets: [],
      chartOptions: {
        maintainAspectRatio: false,
        animation: {
          onComplete: function(num) {
            const chartInstance = num.chartInstance,
              ctx = chartInstance.ctx;
            ctx.font = Chart.helpers.fontString(12, "bold", "Raleway");
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            num.chart.tooltip._data.datasets.forEach(function(dataset, i) {
              const meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                const data = dataset.data[index];
                ctx.fillStyle = "#fff";
                ctx.fillText(data, bar._model.x, bar._model.y + 8);
              });
            });
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          titleFontFamily: "Raleway",
          bodyFontFamily: "Raleway",
          backgroundColor: "#000"
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontFamily: "Raleway"
              },
              gridLines: {
                color: "rgba(154, 154, 154, 0.1)"
              }
            }
          ],
          yAxes: [
            {
              display: false
            }
          ]
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      getTodaysWeatherDetail: "getTodaysWeatherDetail",
      getNextDaysWeatherDetail: "getNextDaysWeatherDetail",
      getTodaySelectedWeatherDetail: "getTodaySelectedWeatherDetail",
      getLocationInfo: "getLocationInfo",
      getGraphLabels: "getGraphLabels",
      getGraphDatasets: "getGraphDatasets"
    })
  },
  watch: {
    getGraphLabels(val) {
      this.graphLabels = val;
    },
    getGraphDatasets(val) {
      this.graphDatasets = val;
      this.fillData();
    },
    getTodaySelectedWeatherDetail(val) {
      this.todaysSelectedWeatherDetail = val;
    },
    getTodaysWeatherDetail(val) {
      this.todaysWeatherDetail = val;
    },
    getNextDaysWeatherDetail(val) {
      this.nextDaysWeatherDetail = val;
    },
    getLocationInfo(val) {
      this.userCurrentSelectedLocation = val;
    }
  },
  mounted() {
    this.nextDaysWeatherDetail = this.getNextDaysWeatherDetail;
    this.userCurrentSelectedLocation = this.getLocationInfo;
    this.dataDismantling();
    this.fillData();
  },
  methods: {
    convertSpeed(val) {
      return Math.round(val * 3.6);
    },
    showWeatherModal() {
      this.$modal.show("weather-modal");
    },
    dataDismantling() {
      this.graphLabels = this.getGraphLabels;
      this.graphDatasets = this.getGraphDatasets;
    },
    fillData() {
      this.datacollection = {
        labels: this.graphLabels,
        datasets: [
          {
            label: "",
            borderJoinStyle: "round",
            fill: false,
            pointBackgroundColor: "#fff",
            pointBorderColor: "#fff",
            pointBorderWidth: 4,
            borderColor: "#fff",
            borderDash: [10, 15],
            borderWidth: "1",
            data: this.graphDatasets
          }
        ]
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
  }
};
</script>
<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/>
