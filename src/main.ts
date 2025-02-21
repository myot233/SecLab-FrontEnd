import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./router/router.ts";
import VueCookies from 'vue-cookies'
import "magic.css/dist/magic.min.css"
createApp(App)
    .use(VueCookies,{expires:"7d"})
    .use(router)
    .mount('#app')
