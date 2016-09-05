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

const Sequelize = require('sequelize')
const logger = require('winston')

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  pool: {
    max: process.env.PG_MAX_CONNECTIONS,
    min: process.env.PG_MIN_CONNECTIONS,
    idle: process.env.PG_IDLE,
  },
  logging: (process.env.PG_LOGGING === 'true') ? logger.info : false,
})

const RedisInstance = require('./redisInstance')(sequelize)

if (process.env.NODE_ENV === 'development') {
  RedisInstance.sync().then(() => {
    logger.warn('Instances table synced!')
  })
}

module.exports = {
  sequelize,
  RedisInstance,
}
