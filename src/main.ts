import { createApp } from 'vue'
// import '../vue-pawel-ui/style.css'
// import pwUi from 'vue-pawel-ui'
import pwUi from '../packages/main'
import App from './App.vue'
const app = createApp(App)
app.use(pwUi)
app.mount('#app')
