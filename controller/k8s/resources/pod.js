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
const constants = require('../../utils/constants')
const util = require('../../utils/util')

module.exports = function (kubeapi) {
  return {

    isPodReady(pod) {
      if (pod.status.phase === 'Running') {
        return true
      }
      return false
    },

    * delete(name) {
      const pod = yield this.getPod(name)
      const podName = pod.metadata.name
      yield kubeapi.delete(`namespaces/${process.env.K8S_NAMESPACE}/` +
        `pods/${podName}`)
    },

    * getPod(instanceName) {
      const redisInstanceName = `redis-${instanceName}`
      const pods = yield kubeapi.get(`namespaces/${process.env.K8S_NAMESPACE}` +
        `/pods?labelSelector=redisnetesInstance%3D${redisInstanceName}`)
      return pods.items[0]
    },

    * wait(name) {
      const timeout = constants.POD_READY_TIMEOUT
      let waited = 0
      while (waited < timeout) {
        logger.debug(`waiting for pod ${name}`)
        waited++
        const pod = yield this.getPod(name)
        const ready = this.isPodReady(pod)
        if (ready) {
          return
        }
        yield util.sleep(1 * 1000)
      }
      throw (new Error('timeout waiting for redis pod to become ready'))
    },
  }
}
