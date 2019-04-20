import express, { Request, Response, Router } from 'express'
import { RequestHandler } from 'express-serve-static-core'

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface IRouterInfo {
  callback: RequestHandler
  method: Methods
  path: string
}

export class BaseController {
  static routers(): Router {
    return this.prototype.router
  }

  public router = express.Router()
  public basePath = ''
  public routerInfos: IRouterInfo[] = []
}

export function route(path?: string, method: Methods = 'GET'): MethodDecorator {
  return (target: BaseController, key: string) => {
    if (!path) {
      path = key
    }
    const callback = async (req: Request, res: Response) => {
      res.send(await target[key]({ ...req.params, ...req.query, ...req.body }))
    }

    if (!target.routerInfos) {
      target.routerInfos = []
    }
    target.routerInfos.push({
      callback,
      method,
      path
    })
  }
}

export function GET(path?: string) {
  return route(path, 'GET')
}

export function POST(path?: string) {
  return route(path, 'POST')
}

export function PUT(path?: string) {
  return route(path, 'PUT')
}

export function DELETE(path?: string) {
  return route(path, 'DELETE')
}

export function router(basePath: string): ClassDecorator {
  return target => {
    if (!target.prototype.router) {
      target.prototype.router = express.Router()
    }

    const targetRouters = target.prototype.router

    target.prototype.routerInfos.forEach(routerInfo => {
      const { method, callback, path } = routerInfo
      switch (method) {
        case 'GET':
          targetRouters.get(basePath + path, callback)
          break
        case 'POST':
          targetRouters.post(basePath + path, callback)
          break
        case 'PUT':
          targetRouters.put(basePath + path, callback)
          break
        case 'DELETE':
          targetRouters.delete(basePath + path, callback)
          break
      }
    })
    target.prototype.basePath = basePath
  }
}
