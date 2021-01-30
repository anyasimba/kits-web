import * as _ from './underscore'
Object.assign(global, _)

declare global {
    const _: typeof _
}
