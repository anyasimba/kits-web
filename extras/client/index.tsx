import { hydrate } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import routes from '../routes'

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
