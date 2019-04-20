import express from 'express'
import { HelloController } from './controllers'

const app = express()
app.use(HelloController.routers())
app.listen(3000, () => {
  console.log('yeaay!! your express server already running on port ', 3000)
})
