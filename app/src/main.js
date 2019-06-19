import Vue from 'vue'
import App from './App.vue'

// Vue Material
import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css'
import './styles/main.scss'
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)
Vue.material.theming.theme = 'default-dark'

// jdenticon
import jdenticon from 'jdenticon'
window.jdenticon = jdenticon

//axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
