/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'
import './src'

declare global {
    interface Route {
        path: string
        exact?: boolean
    }

    // client
    interface NodeModule {
        hot: { accept: () => void }
    }

    // server
    type ServerRequest = Request
    type ServerResponse = Response
    type Middleware = (req: Request, res: Response, next: () => void) => void
    type GetPageInfo = (req: Request, res: Response) => Promise<{ title: string; props: any }>
}
