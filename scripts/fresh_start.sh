#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
compose_file="$repo_root/infra/docker/docker-compose-dev.yml"

cd "$repo_root"

mvn clean install -DskipTests

docker compose -f "$compose_file" build --no-cache

docker compose -f "$compose_file" up 
