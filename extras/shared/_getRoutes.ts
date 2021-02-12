export interface RouteInfo {
    component: React.FC<any>
    componentName: string
    path?: string
    exact?: boolean
}

export function getRoutes(pages: any) {
    return Object.keys(pages)
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
                component: pages.NotFound ? pages.NotFound : () => '404',
            },
        ]) as RouteInfo[]
}
