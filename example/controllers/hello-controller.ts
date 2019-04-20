import { BaseController, ErrorHandler, GET, POST, router } from 'perd'
@router('/hello')
export class HelloController extends BaseController {
  /**
   * if you not provide the path, it will automatically set by
   * the function name `sayHello`
   */
  @GET()
  async sayHello() {
    return 'Hello World'
  }

  /**
   * you can define your route so simple like this
   * @param data - data that already bundled from `req.params` `req.query`
   */
  @GET('/sayHello/:name')
  async sayHelloWithQuery(data: { name: string }) {
    return `Hello ${data.name}`
  }

  @POST('/message')
  async createGreed(data: { message: string }) {
    if (!data.message) {
      // if you want to throw an error just simply throw an error handler
      throw new ErrorHandler(403, "You're not provide the message", true)
    }
  }
}
