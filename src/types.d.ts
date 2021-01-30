declare module '*.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module 'pages/@client' {
    const args: { readonly [key: string]: any }
    export default args
}

declare module 'pages/@server' {
    const args: { readonly [key: string]: any }
    export default args
}
