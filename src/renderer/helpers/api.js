// import Axios from 'axios';
import store from '../store';
// const checkInternetConnected = require('check-internet-connected');
const internetAvailable = require("internet-available");


const weatherURL = 'https://api.openweathermap.org/data/2.5';
const appKey = '6821702d03303a2510a16c962b4b3187';
const iconURL = "https://openweathermap.org/img/wn/";
export default {
    setupWeatherURLByCoordinates(lat, lng) {
        return weatherURL + "/forecast?lat=" + lat + "&lon=" + lng + "&units=metric&appid=" + appKey;
    },
    setupIconURL(imgName) {
        return iconURL + imgName;
    },
    identifyNycthemeron(icon) {
        var date = icon.split(/([0-9]+)/)
        console.log(date)
        return date[2];
    },
    createStatement(weatherId, icon) {
        var statement = {
            motto: "",
            video: "",
            dayStatus: "",
        }
        var nycthemeron = this.identifyNycthemeron(icon);
        if (weatherId >= 200 && weatherId <= 232) {
            statement.motto = "When thunder roars, stay indoors!"
            statement.video = `${__dirname}/../assets/video/thunderstorm.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "stormy night" : "stormy day"
        } // Thunderstorm
        else if (weatherId >= 300 && weatherId <= 504) {
            statement.motto = nycthemeron == 'n' ? "Listen to some Jazz" : "Don't forget an umbrella"
            statement.video = `${__dirname}/../assets/video/rain.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "rainy night" : "rainy day"
        } // Rain
        else if (weatherId == 511) {
            statement.motto = nycthemeron == 'n' ? "Go to sleep" : "Stay off the road"
            statement.video = `${__dirname}/../assets/video/rain.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "freezing rainy night" : "freezing raindy day"
        } // Freezing rain
        else if (weatherId >= 520 && weatherId <= 531) {
            statement.motto = nycthemeron == 'n' ? "wear something warm" : "Don't forget an umbrella or just stay home"
            statement.video = `${__dirname}/../assets/video/rain.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "rainy night" : "rainy day"
        } // Shower Rain
        else if (weatherId >= 600 && weatherId <= 613) {
            statement.motto = nycthemeron == 'n' ? "wear something warm" : "Don't forget an umbrella or just wear a coat"
            statement.video = `${__dirname}/../assets/video/snow.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "snowy night" : "snowy day"
        } // Snow
        else if (weatherId >= 615 && weatherId <= 622) {
            statement.motto = nycthemeron == 'n' ? "Listen to some Jazz" : "Don't forget an umbrella and also wear a coat"
            statement.video = `${__dirname}/../assets/video/rain_and_snow.mp3`
            statement.dayStatus = nycthemeron == 'n' ? "rainy and snowy night" : "rainy and snowy day"
        } // Rain and Snow
        else if (weatherId >= 700 && weatherId <= 771) {
            statement.motto = "The Atmosphere is harsh, stay indoors"
            statement.video = `${__dirname}/../assets/video/atmosphere.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "harsh night" : "harsh day"
        } // Atmosphere | smoke
        else if (weatherId == 781) {
            statement.motto = "Evacuate Immediately"
            statement.video = `${__dirname}/../assets/video/tornado.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "terrible night" : "terrible day"
        } // Tornado
        else if (weatherId == 800) {
            statement.motto = "It's a beautiful weather, Enjoy!"
            statement.video = `${__dirname}/../assets/video/clear_sky.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "Clear Night" : "Sunny day"
        } // Clear
        else if (weatherId == 801) {
            statement.motto = "It's a nice weather! Relax"
            statement.video = `${__dirname}/../assets/video/clouds.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "Beautiful and Cloudy night" : "sunny and cloudy day"
        } // Few Clouds
        else if (weatherId == 802) {
            statement.motto = nycthemeron == 'n' ? "Sleep tight" : "Awesome for a walk outside"
            statement.video = `${__dirname}/../assets/video/clouds.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "cloudy night" : "cloudy day"
        } // Scattered Clouds
        else if (weatherId == 803) {
            statement.motto = "you might wanna wear something a little warm"
            statement.video = `${__dirname}/../assets/video/clouds.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "little bit of a cloudy night" : "a little crowded cloudy day"
        } // Broken Clouds
        else if (weatherId == 804) {
            statement.motto = "It might rain any moment now!"
            statement.video = `${__dirname}/../assets/video/clouds.mp4`
            statement.dayStatus = nycthemeron == 'n' ? "heavily cloudy night" : "heavily cloudy day"
        } // Overcast Clouds
        return statement
    },
    groupBy(list, keyGetter, dateConversion = false) {
        const map = new Map();
        if (!list || list.length === 0) {
            return map;
        }
        list.forEach(item => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                !dateConversion ? map.set(key, [item]) : map.set(this.convertWeekDayByName(key), [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    },
    convertWeekDayByName(key) {
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        return weekday[new Date(key).getDay()];
    },
    groupWeatherByDate(weatherData, dateConversion = false, timeSensitive = false) {
        return this.groupBy(weatherData, weatherData => !timeSensitive ? weatherData.dt_txt.split(" ")[0] : weatherData.dt_txt, dateConversion)
    },
    theCurrentDay() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    },
    excludeTheCurrentDay() {
        return this.convertWeekDayByName(this.theCurrentDay());
    },
    async getWeatherForToday(weatherData) {
        return new Promise(resolve => {
            var today = this.theCurrentDay();
            var weatherGroup = this.groupWeatherByDate(weatherData);
            resolve(weatherGroup.get(today.toString()));
        })
    },
    convertTimeForLabel(date, option = false) {
        if (!option) var separateDate = date.split(" ");
        var separateTime;
        !option ? separateTime = separateDate[1].split(":") : separateTime = date.split(":");
        var time = null;
        if (+separateTime[0] == 12)
            time = separateTime[0] + ":" + separateTime[1] + " pm";
        else {
            if (+separateTime[0] == "00") time = "12:" + separateTime[1] + " pm";
            else {
                if (+separateTime[0] > 12)
                    time = +separateTime[0] - 12 + ":" + separateTime[1] + " pm";
                else time = +separateTime[0] + ":" + separateTime[1] + " am";
            }
        }
        return time;
    },
    convertMapsToObjects(mapInstance) {
        const obj = {};
        for (let prop of mapInstance) {
            obj[prop[0]] = prop[1];
        }
        return obj;
    },
    async getWeatherForTheNextDays(weatherData) {
        return new Promise(resolve => {
            var toBeExcluded = this.excludeTheCurrentDay();
            var weatherGroupByDate = this.groupWeatherByDate(weatherData, true);
            weatherGroupByDate.delete(toBeExcluded);
            resolve(this.convertMapsToObjects(weatherGroupByDate));
        })
    },
    createDate(date) {
        var splitAllDate = date.split(" ");
        var splitDate = splitAllDate[0].split('-');
        var splitTime = splitAllDate[1].split(':');
        var formattedDate = new Date(splitDate[0], splitDate[1] - 1, splitDate[2], splitTime[0], splitTime[1], splitTime[2], 0);
        return formattedDate
    },
    calculateTimeDifference(now, forecastDate) {
        var nowTime = now.getTime();
        var forecastTime = forecastDate.getTime();
        if (isNaN(forecastDate)) {
            return;
        }
        if (forecastTime < nowTime) var diff = nowTime - forecastTime;
        else var diff = forecastTime - nowTime;
        var minDiff = Math.round(diff / 1000 / 60)
        return minDiff;
    },
    async minValFromObject(object) {
        return new Promise(resolve => {
            var [lowestItems] = Object.entries(object).sort(([k1, v1], [k2, v2]) => v1 - v2);
            resolve(lowestItems);
        })
    },
    async checkWeatherTime(now, todaysWeatherData = []) {
        return new Promise(resolve => {
            var todaysWeatherStringTimeData = {};
            var date = new Date(now)
            todaysWeatherData.forEach(weatherData => {
                const weatherForecastTime = this.createDate(weatherData.dt_txt);
                var calculatedTime = this.calculateTimeDifference(date, weatherForecastTime);
                todaysWeatherStringTimeData[weatherData.dt_txt] = calculatedTime;
            })
            resolve(todaysWeatherStringTimeData);
        })
    },
    getReactiveCurrentWeatherForecast(now, todaysWeatherData = []) {
        return new Promise(async resolve => {
            var todaysWeatherStringTimeData = await this.checkWeatherTime(now, todaysWeatherData);
            var minimumKeyOfValue = await this.minValFromObject(todaysWeatherStringTimeData)
            var selectedWeather = this.groupWeatherByDate(todaysWeatherData, false, true).get(minimumKeyOfValue[0])
            resolve(selectedWeather[0])
        });
    },
    async isConnected() {
        return await internetAvailable({
            timeout: 4000,
            retries: 10,
        });
    },
    convertDateAndTime(date = new Date()) {
        const year = date.getFullYear();
        const dd = date.getDate()
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthName = months[date.getMonth()]
        const dayName = days[date.getDay()]
        const Hours = String(date.getHours()).padStart(2, '0');
        const Minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const mseconds = date.getMilliseconds()
        const formattedTime = `${Hours}:${Minutes}:${seconds}:${mseconds}`
        const convertedTime = this.convertTimeForLabel(formattedTime, true)
        return `${convertedTime} - ${dayName}, ${dd} ${monthName} ${year}`
    }
};