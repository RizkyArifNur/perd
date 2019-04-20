import { BaseController, GET, router } from 'serd'
@router('/hello')
export class HelloController extends BaseController {
  @GET('/')
  async sayHello() {
    return 'hello World'
  }
}
