import { hydrate } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getRoutes } from '../shared'

declare const CWD: string
declare const global: any
global.pages(require.context(`${CWD}/src/pages`, true))

const pages: any = {}
global.pageResult.forEach((fn: () => any) => {
    const result = fn()
    Object.keys(result).forEach((key: string) => {
        pages[key] = result[key]
    })
})

const routes = getRoutes(pages)

hydrate(
    <BrowserRouter>
        <Switch>
            {routes.map(route => (
                <Route
                    key={route.componentName}
                    path={route.path}
                    exact={route.exact !== false}
                    component={() => {
                        const props = JSON.parse((window as any).___PAGE_PROPS___) || {}
                        return <route.component {...props} />
                    }}
                />
            ))}
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
)

if (module.hot) {
    module.hot.accept()
}
