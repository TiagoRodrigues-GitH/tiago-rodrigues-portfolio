# Faster start-up on Render's free plan (0.1 CPU): C1 compiler only, serial GC (single small heap),
# and a CDS archive of the classes Spring loads, recorded by a training run at build time.
# The training run stops right after the context starts (spring.context.exit=onRefresh) and uses the
# built-in H2 default, so it needs no database, network or secrets.
ARG JVM_FLAGS="-XX:TieredStopAtLevel=1 -XX:+UseSerialGC"

# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Extract the jar into /app and record the CDS archive (same JRE and same path as the runtime,
# otherwise the JVM ignores the archive)
FROM eclipse-temurin:17-jre AS cds
ARG JVM_FLAGS
COPY --from=build /build/target/*.jar /tmp/app.jar
RUN java -Djarmode=tools -jar /tmp/app.jar extract --destination /app \
 && cd /app \
 && java $JVM_FLAGS -XX:ArchiveClassesAtExit=/app/app.jsa -Dspring.context.exit=onRefresh -jar /app/app.jar

# Stage 3: Free offline IP -> country database ("IP to Country Lite" by DB-IP.com, CC BY 4.0).
# Tries this month's file, then last month's; if both fail the image still builds and visits get no country.
FROM alpine:3 AS geo
RUN mkdir -p /geo && cd /geo \
 && for m in "$(date +%Y-%m)" "$(date -d "@$(( $(date +%s) - 2678400 ))" +%Y-%m)"; do \
      wget -q -O country.mmdb.gz "https://download.db-ip.com/free/dbip-country-lite-$m.mmdb.gz" \
        && gunzip -f country.mmdb.gz && break; \
      rm -f country.mmdb.gz; \
    done; ls -la /geo

# Stage 4: Run the application
FROM eclipse-temurin:17-jre
ARG JVM_FLAGS
ENV JVM_FLAGS=${JVM_FLAGS}
ENV GEOIP_DB=/geo/country.mmdb
COPY --from=geo /geo /geo
COPY --from=cds /app /app
WORKDIR /app
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JVM_FLAGS -XX:SharedArchiveFile=/app/app.jsa -jar /app/app.jar"]
