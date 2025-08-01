import {app} from './app'
import {runDB} from './repositories/db'


const port = process.env.PORT || 3000

const startApp = async () => {
  await runDB()
  app.listen(port, () => {
    console.log(`backend was started on port ${port}`)
  })
}


startApp()