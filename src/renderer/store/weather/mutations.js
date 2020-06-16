export default {
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
}