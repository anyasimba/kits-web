import * as _ from './Link'
Object.assign(global, _)

declare global {
    const Link: typeof _.Link
}
