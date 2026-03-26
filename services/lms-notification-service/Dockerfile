FROM eclipse-temurin:17-jre
RUN groupadd -r spring && useradd -r -g spring spring
WORKDIR /app
COPY services/lms-notification-service/target/*.jar app.jar
EXPOSE 8088
USER spring:spring
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
