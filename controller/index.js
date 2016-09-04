/*
 * Copyright (c) 2016 Felipe Cavalcanti <me@felipejfc.com>
 * Author: Felipe Cavalcanti <me@felipejfc.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.NODE_PORT = process.env.NODE_PORT || 5000
process.env.LOG_LEVEL = process.env.LOG_LEVEL ||
  (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
process.env.K8S_NAMESPACE = process.env.K8S_NAMESPACE || 'redisletes'
process.env.K8S_API_ADDRESS = process.env.K8S_API_ADDRESS || 'localhost:8080'
process.env.K8S_API_USERNAME = process.env.K8S_API_USERNAME || 'admin'
process.env.K8S_API_PASSWORD = process.env.K8S_API_PASSWORD || 'password'
process.env.K8S_API_USEAUTH = process.env.K8S_API_USEAUTH || true
process.env.K8S_API_VERSION = process.env.K8S_API_VERSION || '/api/v1'

const logger = require('./api/lib/logger')()
const api = require('./api')

api.listen(process.env.NODE_PORT, () => {
  logger.info(`redisnetes controller listening on port: ${process.env.NODE_PORT}`)
})

module.exports = api
