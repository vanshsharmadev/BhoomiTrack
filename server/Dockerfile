# Build Stage
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy maven wrapper and pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw

# Download dependencies offline for fast builds
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user and uploads directory
RUN addgroup --system spring && adduser --system spring --ingroup spring
RUN mkdir -p /app/uploads && chown -R spring:spring /app

USER spring:spring

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Render dynamic port support & JVM memory optimization for 512MB RAM
ENV PORT=8080
ENV JAVA_OPTS="-Xms128m -Xmx384m -XX:+UseG1GC -XX:+UseStringDeduplication"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
