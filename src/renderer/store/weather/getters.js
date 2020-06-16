import api from '../helpers/api'
export default {
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
}