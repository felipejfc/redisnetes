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

const K8s = require('k8s')

const kubeapi = K8s.api({
  endpoint: process.env.K8S_API_ADDRESS,
  namespace: process.env.K8S_NAMESPACE,
  version: process.env.K8S_API_VERSION,
  auth: process.env.K8S_API_USEAUTH ? {
    username: process.env.K8S_API_USERNAME,
    password: process.env.K8S_API_PASSWORD,
  } : null,
})

module.exports = {

  * post(next) {
    yield next
  },

  * get(next) {
    const replicasets = yield kubeapi.get(`namespaces/${process.env.K8S_NAMESPACE}/replicasets`)
    this.body = replicasets
    yield next
  },

}
