package org.example.analytics;

import com.maxmind.db.CHMCache;
import com.maxmind.db.Reader;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Map;

/**
 * Offline IP -> country lookup (ISO 3166 alpha-2 code). Uses the free "IP to Country Lite" database by DB-IP
 * (https://db-ip.com, CC BY 4.0) in MaxMind DB format, downloaded when the Docker image is built.
 * Nothing is sent to third parties. Without the file every lookup returns null.
 */
@Service
public class GeoIpService {

    private static final Logger LOG = LoggerFactory.getLogger(GeoIpService.class);

    private final Reader reader;

    @org.springframework.beans.factory.annotation.Autowired
    public GeoIpService(@Value("${app.analytics.geoip-db:}") String path) {
        this.reader = open(path);
    }

    /** Package-private for tests: a service without a database. */
    GeoIpService(Reader reader) {
        this.reader = reader;
    }

    public boolean available() {
        return reader != null;
    }

    /** Two-letter country code, or null when unknown (private address, no database, bad input). */
    @SuppressWarnings("unchecked")
    public String country(String ip) {
        if (reader == null || ip == null || ip.isBlank() || !ip.matches("[0-9a-fA-F:.]+")) {
            return null;
        }
        try {
            Map<String, Object> record = reader.get(InetAddress.getByName(ip), Map.class);
            if (record == null) {
                return null;
            }
            Object country = record.get("country");
            if (country instanceof Map<?, ?> c && c.get("iso_code") instanceof String code && code.length() == 2) {
                return code.toUpperCase();
            }
            return null;
        } catch (IOException | RuntimeException e) {
            return null;
        }
    }

    @PreDestroy
    void close() throws IOException {
        if (reader != null) {
            reader.close();
        }
    }

    private static Reader open(String path) {
        if (path == null || path.isBlank()) {
            return null;
        }
        File file = new File(path);
        if (!file.isFile()) {
            LOG.info("GeoIP database not found at {}: visits are stored without country", path);
            return null;
        }
        try {
            Reader r = new Reader(file, new CHMCache());
            LOG.info("GeoIP database loaded: {} ({})", path, r.getMetadata().getDatabaseType());
            return r;
        } catch (IOException e) {
            LOG.warn("GeoIP database could not be opened: {}", e.getMessage());
            return null;
        }
    }
}
