import Axios from 'axios'
export default {
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
}