import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SplashScreen from '../components/SplashScreen.vue'
import NoInternet from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/splash',
    name: 'Splash',
    component: SplashScreen,
    meta: {
      layout: 'splash',
    }
  }
  //  {
  //    path: '/noInternet',
  //    name: "NoInternet",
  //    component: NoInternet
  //  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
