import {app} from './app'

const port = 3000

app.listen(port, '0.0.0.0',() => {
  console.log(`backend was started on port ${port}`)
}) 