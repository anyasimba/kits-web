export { default as styled } from 'styled-components'

export function styledWithNested<T>(styled: T) {
    return <N>(nested: N) => {
        nested && Object.assign(styled, nested)
        return styled as T & N
    }
}
