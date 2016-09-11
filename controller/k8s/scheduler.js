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
const redisInstance = require('../models/').RedisInstance

module.exports = function (replicationcontroller, service, pod) {
  return {

    * rollback(name) {
      logger.warn(`rolling back creation of redis intance ${name}`)
      yield replicationcontroller.delete(name)
      yield service.delete(name)
      yield pod.delete(name)
    },

    * deployInstance(name, redisVersion) {
      try {
        const rc = yield replicationcontroller.create(name, redisVersion)
        logger.debug(`create replicationcontroller result ${JSON.stringify(rc)}`)
        const svc = yield service.create(name)
        yield replicationcontroller.wait(name)
        yield pod.wait(name)
        logger.debug(`create service result ${JSON.stringify(svc)}`)
        const dbInstance = yield redisInstance.create({
          name,
          redisVersion,
          replicationControllerManifest: rc,
          serviceManifest: svc,
        })
        logger.debug(`redis instance metadata persisted into db ${JSON.stringify(dbInstance)}`)
        return { rc, svc }
      } catch (e) {
        try {
          if (e.message.indexOf('timeout waiting') > -1) {
            yield this.rollback(name)
          }
        } catch (errRollback) {
          logger.warn(`error while rolling back instance creation: ${errRollback}`)
        }
        throw e
      }
    },
  }
}
