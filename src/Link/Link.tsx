import { Link as ReactRouterLink, LinkProps, useHistory } from 'react-router-dom'

export const Link = (props: LinkProps) => {
    const { to } = props
    const history = useHistory()

    const follow = useCallback(
        (to: string) => {
            if (to.indexOf('://') !== -1) {
                location.href = to
                return
            }
            if (to === location.host) {
                return
            }

            fetch(`/api${to}`).then(async response => {
                if (response.redirected) {
                    if (response.url.startsWith(location.origin)) {
                        follow(response.url.slice(location.origin.length))
                        return
                    }
                    follow(response.url)
                    return
                }

                const pageInfo = await response.json()
                document.querySelector('head title').innerHTML = pageInfo.title
                ;(window as any).___PAGE_PROPS___ = JSON.stringify(pageInfo.props)
                history.push(to)
            })
        },
        [history]
    )

    return (
        <ReactRouterLink
            {...props}
            onClick={e => {
                e.preventDefault()
                follow(to.toString())
            }}
        />
    )
}
