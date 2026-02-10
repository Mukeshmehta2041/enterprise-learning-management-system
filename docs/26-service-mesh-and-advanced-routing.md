# Service Mesh & Advanced Routing

## Overview
As the LMS microservices architecture grows in complexity, managing service-to-service communication, security (mTLS), and traffic routing (canary/blue-green) becomes challenging. This document describes the role of the **Service Mesh (Istio)** in our infrastructure.

## 1. Decision: Why Istio?
After evaluation, we adopted **Istio** as our service mesh for:
- **Zero-Trust Security:** Automatic mTLS (Mutual TLS) between all services in the cluster.
- **Traffic Management:** Fine-grained control for canary deployments and A/B testing (Day 39).
- **Observability:** Automatic collection of L7 metrics and distributed traces without code changes.
- **Resilience:** Mesh-level retries, timeouts, and circuit breaking.

## 2. Security (mTLS)
- **Automatic Encryption:** Every request between service A and service B is encrypted using mutual TLS.
- **Identity:** Istio issues certificates to each service based on its Kubernetes Service Account.
- **Policy:** `PeerAuthentication` is set to `STRICT` to reject any non-encrypted traffic within the mesh.

## 3. Traffic Routing Patterns

### Canary Deployments
We use Istio `VirtualService` and `DestinationRule` to shift traffic gradually from v1 to v2.
```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: course-service
spec:
  hosts:
  - course-service
  http:
  - route:
    - destination:
        host: course-service
        subset: v1
      weight: 90
    - destination:
        host: course-service
        subset: v2
      weight: 10
```

### Fault Injection (Chaos Engineering)
Istio allows us to inject synthetic failures (e.g., 5-second delay for 10% of requests) to test the system's resilience without modifying application code.

## 4. Operational Overhead
- **Sidecar Proxy:** Every pod runs an `istio-proxy` (Envoy) container.
- **Resources:** Standard overhead is ~0.5 vCPU and ~50MB RAM per proxy.
- **Latency:** mTLS and proxying add ~1-2ms of latency per hop, which is acceptable for our SLOs.

## 5. Troubleshooting
- **Kiali:** Dashboard for visualizing service dependencies and traffic health.
- **istioctl:** CLI tool used to verify proxy configuration and certificate status.
- **Logs:** Sidecar access logs provide detailed status codes and timings for inter-service calls.
