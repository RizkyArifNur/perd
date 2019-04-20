export class ErrorHandler {
  readonly statusCode: number
  readonly message: string
  readonly toJson: boolean = false
  /**
   * Create Error Handler for `Nerd` package
   * @remarks
   * this class will create error handler that can be passed to `BaseController`
   * if you want to create some error like validations error, auth error,etc please
   * use thi class, if you don't, your error will passed as `500 Internal server error`
   * @param statusCode - http status code (200,300,500) if you pass `500` `nerd` will automatically
   * throw an `Internal server error`
   * @param message - error message that will be shown
   * @param [toJson] - optional, set this true if you want to show your error as json
   * like this :
   * ```ts
   * {status:403,message : "Validation Error"}```
   */
  constructor(statusCode: number, message: string, toJson?: boolean) {
    this.statusCode = statusCode
    this.message = statusCode === 500 ? 'Internal server error' : message
    this.toJson = toJson || false
  }
}
