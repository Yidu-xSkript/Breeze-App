import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState } from "vuex-electron"
import Axios from 'axios'
import api from '../helpers/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userCurrentLocation: { lat: 0, lng: 0 },
    locationInfo: "",
    todaysWeatherDetail: [],
    todaySelectedWeatherDetail: {},
    nextDaysWeatherDetail: {},
    now: new Date(),
    exactlyNow: new Date(),
    graphLabels: [],
    graphDatasets: [],
  },
  actions: {
    updateTime({ commit }) {
      setInterval(() => {
        commit('setNow', new Date())
      }, 1000 * 600)
    },
    updateExactlyNow({ commit }) {
      setInterval(() => {
        commit('setExactlyNow', new Date())
      }, 1000 * 30)
    },
    setGraphOptions({ commit }, payLoad) {
      return new Promise(resolve => {
        commit('setGraphLabels', payLoad.graphLabels)
        commit('setGraphDatasets', payLoad.graphDatasets)
        resolve(true)
      })
    },
    setTodaySelectedWeatherDetail_Action({ commit }, payLoad) {
      return new Promise(resolve => {
        commit('setTodaySelectedWeatherDetail', payLoad);
        resolve(true)
      })
    },
    async setWeatherDetail({ commit }, payLoad) {
      return new Promise((resolve) => {
        commit('setTodaysWeatherDetail', payLoad.todaysWeather);
        commit('setNextDaysWeatherDetail', payLoad.weatherForTheNextDays);
        resolve(true)
      });
    },
    weatherInformation({ commit }, payLoad) {
      return new Promise((resolve, reject) => {
        Axios.get(payLoad.apiPath)
          .then(response => {
            commit('setNextDaysWeatherDetail', {})
            resolve(response)
          }).catch(err => {
            console.log(err)
            reject(false)
          })
      });
    },
    async setCoordinates({ commit }, payLoad) {
      return new Promise((resolve) => {
        commit('setUserCurrentLocation', { lat: payLoad.lat, lng: payLoad.lng });
        resolve(true)
      })
    },
    async setAddress({ commit }, payLoad) {
      return new Promise((resolve) => {
        commit('setLocationInfo', payLoad)
        resolve(true)
      })
    },
    // async triggerCurrentLocation({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     if ("geolocation" in navigator) {
    //       navigator.geolocation.getCurrentPosition(
    //         position => {
    //           console.log(position.coords.latitude);
    //           console.log(position.coords.longitude);
    //           commit('setUserCurrentLocation', { lat: position.coords.latitude, lng: position.coords.longitude });
    //           resolve(true)
    //         },
    //         error => {
    //           console.log(error.message);
    //           reject("an error has occured!")
    //         },
    //       )
    //     } else {
    //       console.log('geolocation IS NOT available on your browser');
    //     }
    //   });
    // }
  },
  getters: {
    getUserCurrentLocation(state) {
      return state.userCurrentLocation;
    },
    getLocationInfo(state) {
      return state.locationInfo;
    },
    getTodaysWeatherDetail(state) {
      return state.todaysWeatherDetail;
    },
    getNextDaysWeatherDetail(state) {
      return state.nextDaysWeatherDetail;
    },
    getTodaySelectedWeatherDetail(state) {
      return state.todaySelectedWeatherDetail;
    },
    getReactiveCurrentWeatherForecast(state) {
      return api.getReactiveCurrentWeatherForecast(state.now, state.todaysWeatherDetail != undefined ? state.todaysWeatherDetail : null)
    },
    getNow(state) {
      return state.now;
    },
    getExactlyNow(state) {
      return state.exactlyNow;
    },
    getGraphLabels(state) {
      return state.graphLabels;
    },
    getGraphDatasets(state) {
      return state.graphDatasets;
    },
  },
  mutations: {
    setNow(state, payLoad) {
      state.now = payLoad;
    },
    setExactlyNow(state, payLoad) {
      state.exactlyNow = payLoad;
    },
    setGraphLabels(state, payLoad) {
      state.graphLabels = payLoad;
    },
    setGraphDatasets(state, payLoad) {
      state.graphDatasets = payLoad;
    },
    setUserCurrentLocation(state, payLoad) {
      state.userCurrentLocation = payLoad;
    },
    setLocationInfo(state, payLoad) {
      state.locationInfo = payLoad;
    },
    setTodaysWeatherDetail(state, payLoad) {
      state.todaysWeatherDetail = payLoad;
    },
    setTodaySelectedWeatherDetail(state, payLoad) {
      state.todaySelectedWeatherDetail = payLoad;
    },
    setNextDaysWeatherDetail(state, payLoad) {
      state.nextDaysWeatherDetail = payLoad;
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState(),
  ],
  strict: process.env.NODE_ENV !== "production"
})
