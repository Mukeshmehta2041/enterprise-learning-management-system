FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder
WORKDIR /workspace
COPY . .
RUN mvn -B -ntp -f lms-common/pom.xml install -DskipTests
RUN mvn -B -ntp -f services/lms-notification-service/pom.xml package -DskipTests

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
WORKDIR /app
COPY --from=builder /workspace/services/lms-notification-service/target/*.jar app.jar
EXPOSE 8088
USER spring:spring
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
