import 'source-map-support/register'
import express from 'express'
import CookieParser from 'cookie-parser'
import { renderToString } from 'react-dom/server'
import { Route, StaticRouter, Switch } from 'react-router'
import { getRoutes, RouteInfo } from '../shared'

declare const CWD: string
const PORT = 3019
declare const global: any
global.pages(require.context(`${CWD}/src/pages`, true))

const pages: any = {}
global.pageResult.forEach((fn: () => any) => {
    const result = fn()
    Object.keys(result).forEach((key: string) => {
        pages[key] = result[key]
    })
})

const serverPages: any = {}
global.serverResult.forEach((fn: () => any) => {
    const result = fn()
    Object.keys(result).forEach((key: string) => {
        serverPages[key] = result[key]
    })
})

const routes = getRoutes(pages)

const server = express()
server.use(CookieParser())

const scripts: Array<string> = ['http://localhost:8080/app.js']

const tags = ['Api', 'Middlewares']

const pageInfoGetters: any = {}
Object.keys(serverPages)
    .filter(key => tags.every(tag => !key.endsWith(tag)))
    .forEach(key => (pageInfoGetters[key] = serverPages[key]))

server.get('/api/*', (req, res) => {
    const route = getRoute(req.url.slice(4))
    runMiddlewares(route, req, res, async () => {
        const pageInfo = await getPageInfo(route, req, res)
        if (res.headersSent) {
            return
        }
        res.send(pageInfo)
    })
})

server.get('*', (req, res) => {
    const route = getRoute(req.url)
    runMiddlewares(route, req, res, async () => {
        const pageInfo = await getPageInfo(route, req, res)
        if (res.headersSent) {
            return
        }

        const context: { url?: string } = {}
        const content = renderToString(
            <StaticRouter location={req.url} context={context}>
                <Switch>
                    {routes.map(route => (
                        <Route
                            key={route.componentName}
                            path={route.path}
                            exact={route.exact !== false}
                            component={() => <route.component {...pageInfo.props} />}
                        />
                    ))}
                </Switch>
            </StaticRouter>
        )

        res.send(getHtml(pageInfo.title, pageInfo.props, content, scripts))
    })
})

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const getRoute = (url: string) => {
    return (
        routes.find(route => route.path === url) ||
        routes.find(route => route.componentName === 'NotFound')
    )
}

const runMiddlewares = async (
    route: RouteInfo,
    req: ServerRequest,
    res: ServerResponse,
    cb: () => void
) => {
    const middlewares = serverPages[`${route.componentName}Middlewares`]

    const runMiddleware = async (i: number) => {
        const middleware = middlewares[i]
        if (i + 1 < middlewares.length) {
            await middleware(req, res, () => runMiddleware(i + 1))
            return
        }
        await middleware(req, res, cb)
    }

    if (middlewares && middlewares.length > 0) {
        await runMiddleware(0)
        return
    }

    cb()
}

const getPageInfo = async (route: RouteInfo, req: ServerRequest, res: ServerResponse) => {
    let pageInfo: { title: string; props: unknown }

    if (route && pageInfoGetters[route.componentName]) {
        const getPageInfo = pageInfoGetters[route.componentName]
        pageInfo = await getPageInfo(req, res)
    }

    if (pageInfo == null) {
        pageInfo = { title: '', props: null }
    }
    pageInfo.title = pageInfo.title || ''
    pageInfo.props = pageInfo.props || null

    return pageInfo
}

function getHtml(title: string, props: any, content: string, scripts: Array<string>) {
    return `
        <!DOCTYPE html>
        <html lang='ru'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>${title}</title>
        </head>
        <body>
            <div id='root'>${content}</div>
            <script>var ___PAGE_PROPS___ = '${JSON.stringify(props)}'</script>
            ${scripts.map(script => `<script src='${script}'></script>`)}
        </body>
        </html>
    `
}
