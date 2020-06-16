import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState } from "vuex-electron"
import weather from './weather'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    weather
  },
  plugins: [
    createPersistedState(),
  ],
  strict: process.env.NODE_ENV !== "production"
})
