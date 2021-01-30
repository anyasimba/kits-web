import * as pages from 'pages/@client'
const pages_: any = pages

export interface RouteInfo {
    component: React.FC<any>
    componentName: string
    path?: string
    exact?: boolean
}

export default Object.keys(pages)
    .filter(key => key.endsWith('Route'))
    .map(
        key =>
            ({
                component: pages[key.slice(0, -5) as keyof typeof pages],
                componentName: key.slice(0, -5),
                ...pages[key as keyof typeof pages],
            } as RouteInfo)
    )
    .concat([
        {
            componentName: 'NotFound',
            component: pages_.NotFound ? pages_.NotFound : () => '404',
        },
    ]) as RouteInfo[]
