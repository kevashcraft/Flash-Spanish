import Vue from 'vue'
import App from './App.vue'
// store
import store from './store'

// Vue Material
import { MdButton, MdContent, MdField, MdList, MdMenu, MdSwitch, MdTabs } from 'vue-material/dist/components'
import { MdIcon } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css'
import './styles/main.scss'
Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdField)
Vue.use(MdIcon)
Vue.use(MdList)
Vue.use(MdMenu)
Vue.use(MdSwitch)
Vue.use(MdTabs)
// Vue.material.theming.theme = 'default-dark'

// jdenticon
import jdenticon from 'jdenticon'
window.jdenticon = jdenticon

//touch
import Vue2TouchEvents from 'vue2-touch-events'
Vue.use(Vue2TouchEvents)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
