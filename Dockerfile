# Multi-stage Dockerfile for National Land Acquisition & Management System (NLAMS)
# Build Stage
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper and POM from server directory
COPY server/.mvn/ .mvn
COPY server/mvnw server/pom.xml ./
RUN sed -i 's/\r$//' ./mvnw && chmod +x ./mvnw

# Download dependencies offline for fast build caching
RUN ./mvnw dependency:go-offline -B || true

# Copy server source code and package application
COPY server/src ./src
RUN ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user and uploads directory for security
RUN addgroup --system spring && adduser --system spring --ingroup spring
RUN mkdir -p /app/uploads && chown -R spring:spring /app

USER spring:spring

# Copy compiled jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Production JVM tuning for cloud platforms (Render, Railway, AWS, Fly.io, etc.)
ENV PORT=8080
ENV JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseG1GC -XX:+UseStringDeduplication -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
