package com.nla.common.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.io.File;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.time.Instant;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Health Check", description = "System, Database, PostGIS, and Infrastructure Health Monitoring")
public class HealthController {

    private final DataSource dataSource;
    private final JdbcTemplate jdbcTemplate;
    private final Environment environment;

    private static final long START_TIME = System.currentTimeMillis();

    @GetMapping({"/health", "/api/health"})
    @Operation(summary = "Comprehensive Health & Readiness Check", description = "Verifies application, PostgreSQL connectivity, PostGIS extension, JVM memory, and uptime")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new LinkedHashMap<>();
        Map<String, Object> components = new LinkedHashMap<>();

        boolean isHealthy = true;

        // 1. Database & PostGIS Verification
        Map<String, Object> dbHealth = new LinkedHashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            boolean valid = connection.isValid(3);
            DatabaseMetaData metaData = connection.getMetaData();
            
            dbHealth.put("status", valid ? "UP" : "DOWN");
            dbHealth.put("databaseProduct", metaData.getDatabaseProductName());
            dbHealth.put("databaseVersion", metaData.getDatabaseProductVersion());

            // PostGIS version check
            try {
                String postgisVersion = jdbcTemplate.queryForObject("SELECT postgis_full_version()", String.class);
                dbHealth.put("postgis", "ENABLED");
                dbHealth.put("postgisDetails", postgisVersion != null && postgisVersion.length() > 60 
                        ? postgisVersion.substring(0, 60) + "..." 
                        : postgisVersion);
            } catch (Exception ex) {
                // PostGIS might be a standard table/extension or fallback query
                try {
                    String simpleVersion = jdbcTemplate.queryForObject("SELECT postgis_version()", String.class);
                    dbHealth.put("postgis", "ENABLED (" + simpleVersion + ")");
                } catch (Exception e) {
                    dbHealth.put("postgis", "NOT_DETECTED_OR_RESTRICTED");
                }
            }

            if (!valid) {
                isHealthy = false;
            }
        } catch (Exception e) {
            log.error("Database health check failed: {}", e.getMessage());
            dbHealth.put("status", "DOWN");
            dbHealth.put("error", e.getMessage());
            isHealthy = false;
        }
        components.put("database", dbHealth);

        // 2. JVM Memory Stats
        Runtime runtime = Runtime.getRuntime();
        long mb = 1024 * 1024;
        long totalMemory = runtime.totalMemory() / mb;
        long freeMemory = runtime.freeMemory() / mb;
        long usedMemory = totalMemory - freeMemory;
        long maxMemory = runtime.maxMemory() / mb;

        Map<String, Object> memoryStats = new LinkedHashMap<>();
        memoryStats.put("status", "UP");
        memoryStats.put("usedMb", usedMemory);
        memoryStats.put("freeMb", freeMemory);
        memoryStats.put("totalAllocatedMb", totalMemory);
        memoryStats.put("maxAvailableMb", maxMemory);
        components.put("jvmMemory", memoryStats);

        // 3. Disk Space Stats
        File root = new File(".");
        long diskFreeMb = root.getFreeSpace() / mb;
        long diskTotalMb = root.getTotalSpace() / mb;
        Map<String, Object> diskStats = new LinkedHashMap<>();
        diskStats.put("status", "UP");
        diskStats.put("freeMb", diskFreeMb);
        diskStats.put("totalMb", diskTotalMb);
        components.put("diskSpace", diskStats);

        // 4. Overall Application Info
        long uptimeSeconds = (System.currentTimeMillis() - START_TIME) / 1000;
        health.put("status", isHealthy ? "UP" : "DOWN");
        health.put("application", "National Land Acquisition & Management System (BhoomiTrack)");
        health.put("timestamp", Instant.now().toString());
        health.put("uptimeSeconds", uptimeSeconds);
        health.put("uptimeFormatted", formatUptime(uptimeSeconds));
        health.put("activeProfiles", Arrays.asList(environment.getActiveProfiles()));
        health.put("components", components);

        return ResponseEntity
                .status(isHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
                .body(health);
    }

    private String formatUptime(long seconds) {
        long d = seconds / 86400;
        long h = (seconds % 86400) / 3600;
        long m = (seconds % 3600) / 60;
        long s = seconds % 60;
        return String.format("%dd %02dh %02dm %02ds", d, h, m, s);
    }
}
