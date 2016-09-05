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

const logger = require('winston')

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
      const rcTemplate = template
      const rcName = `redis-${name}`
      rcTemplate.metadata.name = rcName
      rcTemplate.metadata.namespace = process.env.K8S_NAMESPACE
      rcTemplate.spec.selector.app = rcName
      rcTemplate.spec.template.metadata.name = rcName
      rcTemplate.spec.template.metadata.labels.app = rcName
      rcTemplate.spec.template.spec.containers[0].image = `redis:${redisVersion}`
      logger.debug(`creating rc with manifest ${JSON.stringify(rcTemplate)}`)
      const rc = yield kubeapi.post(`namespaces/${process.env.K8S_NAMESPACE}` +
        '/replicationcontrollers',
        rcTemplate)
      return rc
    },
  }
}
