import * as _underscore from './underscore'
Object.assign(global, _underscore)

declare global {
    const _: typeof _underscore._
}
