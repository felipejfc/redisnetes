
Redisnetes
==========

Redis cloud on [Kubernetes](https://github.com/kubernetes/kubernetes)

![](https://github.com/felipejfc/redisnetes/blob/master/misc/proposal.png?raw=true)

## Initial Release Plan:

### CLI
* Redis instances Create (no clustering/replication) (no persistence)
* Redis instances Read (no clustering/replication)
* Redis instances Update (no clustering/replication)
* Redis instances Delete (no clustering/replication)

### Controller
* Redis instances Create (no clustering/replication) (no persistence)
* Redis instances Read (no clustering/replication)
* Redis instances Update (no clustering/replication)
* Redis instances Delete (no clustering/replication)

### Router
* Route to redis intances using a port-based approach
* Make it HA
* Reload on new redis instance creation / removal
