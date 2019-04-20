import { BaseController, ErrorHandler, GET, router } from 'serd'
@router('/hello')
export class HelloController extends BaseController {
  @GET()
  async sayHello() {
    return 'Hello World'
  }

  @GET('/:name')
  async sayHelloWithQuery(data: { name: string }) {
    return `Hello ${data.name}`
  }
}
