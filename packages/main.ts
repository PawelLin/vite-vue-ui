import { App } from 'vue'
import * as components from './components'
export * from './components'

export default {
    install(app: App) {
        Object.keys(components).forEach((key) => {
            const component = components[key as keyof typeof components]
            if (component.install) {
                component.install(app)
            }
        })
        return app
    },
}
