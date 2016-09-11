# Copyright (c) 2016 Felipe Cavalcanti <me@felipejfc.com>
# Author: Felipe Cavalcanti <me@felipejfc.com>
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

setup:
	@npm install

run:
	@npm start

start-deps: start-deps-containers db db-migrate

start-deps-containers:
	@minikube start; true
	@docker-compose --project-name redisnetes up -d
	@echo "Sleeping until dependencies are up..."
	@bash -lc "until docker exec redisnetes_postgres_1 pg_isready; do echo 'Waiting for Postgres...' && sleep 1; done"
	@sleep 5

stop-deps:
	@minikube stop; true
	@docker-compose --project-name redisnetes stop
	@docker rm redisnetes_postgres_1

db:
	@echo "Creating new database..."
	@-docker exec redisnetes_postgres_1 createdb -U postgres redisnetes
	@-docker exec redisnetes_postgres_1 psql -U postgres -d redisnetes -c 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'

db-migrate:
	@./scripts/migrate_db.sh
