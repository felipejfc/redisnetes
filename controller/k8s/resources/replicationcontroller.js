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

const template = {
  apiVersion: 'v1',
  kind: 'ReplicationController',
  metadata: {
    name: '',
    namespace: '',
  },
  spec: {
    replicas: 1,
    selector: {
      app: '',
    },
    template: {
      metadata: {
        name: '',
        labels: {
          api: '',
        },
      },
      spec: {
        containers: [{
          name: 'redis',
          image: 'redis:latest',
          ports: [
            { containerPort: 6379 },
          ],
        }],
      },
    },
  },
}

module.exports = function (kubeapi) {
  return {
    * create(name, redisVersion) {
      const redisRS = template
      const rsName = `redis-${name}`
      redisRS.metadata.name = rsName
      redisRS.metadata.namespace = process.env.K8S_NAMESPACE
      redisRS.spec.selector.app = rsName
      redisRS.spec.template.metadata.name = rsName
      redisRS.spec.template.metadata.labels.app = rsName
      redisRS.spec.template.spec.containers.image = `redis:${redisVersion}`
      const rc = yield kubeapi.post(`namespaces/${process.env.K8S_NAMESPACE}` +
        '/replicationcontrollers',
        redisRS)
      return rc
    },
  }
}