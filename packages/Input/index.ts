import { App } from 'vue'
import Component from './component.vue'

Component.install = function (app: App) {
    app.component('PwInput', Component)
    return app
}

export default Component
