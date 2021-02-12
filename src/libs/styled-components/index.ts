import * as _ from './styled-components'
Object.assign(global, _)

declare global {
    const styled: typeof _.styled
    const styledWithNested: typeof _.styledWithNested
}
