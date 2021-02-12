declare const global: any
global.pages = pages
global.pageResult = []
global.serverResult = []

function pages(context: any) {
    const pages: string[] = []
    context.keys().forEach((key: string) => {
        if (keyIs(key, 'pages')) {
            pages.push(key)
        } else if (keyIs(key, 'page')) {
            global.pageResult.push(() => context(key))
        } else if (keyIs(key, 'server')) {
            global.serverResult.push(() => context(key))
        }
    })
    pages.forEach(key => context(key))
}

function keyIs(key: string, type: string) {
    return key.endsWith(`.${type}`) || key.endsWith(`.${type}.ts`) || key.endsWith(`.${type}.tsx`)
}

export {}
