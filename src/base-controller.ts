import express, { Request, Response, Router } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import { ErrorHandler } from './error-handler'

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
  public basePath = ''
  public routerInfos: IRouterInfo[] = []
  private router = express.Router()
}

export function route(path?: string, method: Methods = 'GET'): MethodDecorator {
  return (target: BaseController, key: string) => {
    if (!path) {
      path = '/' + key
    }
    const callback = (req: Request, res: Response) => {
      target[key]({ ...req.params, ...req.query, ...req.body }, req, res)
        .then(body => {
          res.send(body)
        })
        .catch(error => {
          if (error instanceof ErrorHandler) {
            if (error.toJson) {
              res
                .status(error.statusCode)
                .json({ status: error.statusCode, message: error.message })
            } else {
              res.status(error.statusCode).send(error.message)
            }
          } else {
            res.sendStatus(500)
          }
        })
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
/**
 * Decorators to create route with HTTP verb `GET`
 * @remarks
 * target function must be a `async` function that can be return any value,
 * you can get the `req.params` `req.query`
 * in single param from target function
 * example :
 * ```ts
 * @GET('/sayHello/:name')
 * async function sayHello(params :{name : string},req? : express.Request,res? :express.Response){
 *  params.name
 * }
 * ```
 * @param path optional, path of your route, lead it with slash `/`
 * if you're not define the path of your route, `Nerd` will automatically set the path to
 * your function name
 */
export function GET(path?: string) {
  return route(path, 'GET')
}

/**
 * Decorators to create route with HTTP verb `POST`
 * @remarks
 * target function must be a `async` function that can be return any value,
 * you can get the `req.params` `req.query` `req.body`
 * in single param from target function
 * example :
 * ```ts
 * @POST('/:id/friend/')
 * async function sayHello(params :{id : string},req? : express.Request,res? :express.Response){
 *  params.id
 * }
 * ```
 * @param path optional, path of your route, lead it with slash `/`
 * if you're not define the path of your route, `Nerd` will automatically set the path to
 * your function name
 */
export function POST(path?: string) {
  return route(path, 'POST')
}
/**
 * Decorators to create route with HTTP verb `PUT`
 * @remarks
 * target function must be a `async` function that can be return any value,
 * you can get the `req.params` `req.query` `req.body`
 * in single param from target function
 * example :
 * ```ts
 * @PUT('/friend/:id')
 * async function sayHello(params :{id : string},req? : express.Request,res? :express.Response){
 *  params.id
 * }
 * ```
 * @param path optional, path of your route, lead it with slash `/`
 * if you're not define the path of your route, `Nerd` will automatically set the path to
 * your function name
 */
export function PUT(path?: string) {
  return route(path, 'PUT')
}

/**
 * Decorators to create route with HTTP verb `DELETE`
 * @remarks
 * target function must be a `async` function that can be return any value,
 * you can get the `req.params` `req.query`
 * in single param from target function
 * example :
 * ```ts
 * @DELETE('/friend/:id')
 * async function sayHello(params :{id : string},req? : express.Request,res? :express.Response){
 *  params.id
 * }
 * ```
 * @param path optional, path of your route, lead it with slash `/`
 * if you're not define the path of your route, `Nerd` will automatically set the path to
 * your function name
 */
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
