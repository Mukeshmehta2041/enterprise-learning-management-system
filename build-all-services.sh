#!/bin/bash

# Build All Services Script
# This script builds the entire LMS project including all microservices

set -e  # Exit on any error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📦 Building all LMS services..."
echo "Project root: $PROJECT_ROOT"
echo ""

cd "$PROJECT_ROOT"

# Build all modules
echo "🔨 Running Maven build for all services..."
mvn clean package -DskipTests

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo ""
    echo "📍 Built packages:"
    echo "   - lms-common"
    echo "   - lms-gateway"
    echo "   - lms-auth-service"
    echo "   - lms-course-service"
    echo "   - lms-enrollment-service"
    echo "   - lms-content-service"
    echo "   - lms-assignment-service"
    echo "   - lms-search-service"
    echo "   - lms-notification-service"
    echo "   - lms-payment-service"
    echo "   - lms-analytics-service"
else
    echo "❌ Build failed!"
    exit 1
fi
