#!/bin/bash

# Build Docker Images for All Services
# This script builds Docker images for all services using pre-built JAR files
# Prerequisites: Run ./build-all-services.sh first to build the JAR files

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="${REGISTRY:-}" # Optional Docker registry (e.g., myregistry.com)
TAG="${TAG:-latest}"

echo "🐳 Building Docker images for all services..."
echo "Project root: $PROJECT_ROOT"
echo "Tag: $TAG"
echo ""

cd "$PROJECT_ROOT"

# Check if JAR files exist
echo "✓ Checking for pre-built JAR files..."
if [ ! -f "lms-gateway/target/lms-gateway-1.0.0-SNAPSHOT.jar.original" ] && [ ! -f "lms-gateway/target/*.jar" ]; then
    echo "❌ JAR files not found! Please run ./build-all-services.sh first"
    exit 1
fi

# Array of services with their ports
services=(
    "lms-gateway:8080"
    "lms-common:0"  # Not a service
    "services/lms-auth-service:8082"
    "services/lms-course-service:8083"
    "services/lms-enrollment-service:8084"
    "services/lms-content-service:8085"
    "services/lms-search-service:8086"
    "services/lms-assignment-service:8087"
    "services/lms-notification-service:8088"
    "services/lms-payment-service:8089"
    "services/lms-analytics-service:8090"
)

# Build Docker images
for service_path in "${services[@]}"; do
    service_name=$(echo "$service_path" | cut -d':' -f1)
    
    # Skip lms-common as it's not a service
    if [ "$service_name" == "lms-common" ]; then
        continue
    fi
    
    service_short_name=$(basename "$service_name")
    image_name="${REGISTRY}${service_short_name}:${TAG}"
    
    echo ""
    echo "📦 Building Docker image: $image_name"
    
    CACHE_ARGS=""
    if [ "$CI" = "true" ]; then
        CACHE_ARGS="--build-arg BUILDKIT_INLINE_CACHE=1 --cache-from $image_name"
    fi
    
    if docker build -f "$service_name/Dockerfile" \
        -t "$image_name" \
        --build-arg JAR_FILE="$service_name/target/*.jar" \
        $CACHE_ARGS . ; then
        echo "✅ Built: $image_name"
        
        if [ "$PUSH_IMAGES" = "true" ]; then
            # Auto-create AWS ECR repository if it doesn't exist
            if [[ "$image_name" == *".dkr.ecr."* ]] && command -v aws >/dev/null 2>&1; then
                ecr_region=$(echo "$image_name" | cut -d'.' -f4)
                echo "🔍 Checking if ECR repository '$service_short_name' exists in region $ecr_region..."
                if ! aws ecr describe-repositories --repository-names "$service_short_name" --region "$ecr_region" >/dev/null 2>&1; then
                    echo "🛠️ Creating missing ECR repository: $service_short_name"
                    aws ecr create-repository --repository-name "$service_short_name" --region "$ecr_region" >/dev/null || true
                fi
            fi

            echo "🚀 Pushing to registry: $image_name"
            if ! docker push "$image_name"; then
                echo "❌ Failed to push: $image_name"
                exit 1
            fi
            echo "✅ Pushed successfully: $image_name"
        fi
    else
        echo "❌ Failed to build: $image_name"
        exit 1
    fi
done

echo ""
echo "✅ All Docker images built successfully!"
echo ""
echo "📍 Built images:"
docker images --filter "label=" --format="table {{.Repository}}:{{.Tag}}\t{{.Size}}" | grep -E "lms-|REPOSITORY"

echo ""
echo "💡 Tips:"
echo "   - To push images to a registry: export REGISTRY=myregistry.com/ && ./build-docker-images.sh"
echo "   - To use a different tag: export TAG=v1.0.0 && ./build-docker-images.sh"
echo "   - To run a service: docker run -p 8082:8082 lms-auth-service:latest"
