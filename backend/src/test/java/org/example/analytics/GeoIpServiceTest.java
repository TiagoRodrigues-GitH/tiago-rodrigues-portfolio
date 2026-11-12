package org.example.analytics;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GeoIpServiceTest {

    @Test
    void withoutDatabaseEveryLookupIsNull() {
        GeoIpService geo = new GeoIpService("");
        assertThat(geo.available()).isFalse();
        assertThat(geo.country("8.8.8.8")).isNull();
    }

    @Test
    void missingFileIsNotAnError() {
        GeoIpService geo = new GeoIpService("does-not-exist.mmdb");
        assertThat(geo.available()).isFalse();
        assertThat(geo.country("2001:4860:4860::8888")).isNull();
    }

    @Test
    void rejectsInputThatIsNotAnIpAddress() {
        GeoIpService geo = new GeoIpService((com.maxmind.db.Reader) null);
        assertThat(geo.country("example.com")).isNull();
        assertThat(geo.country(null)).isNull();
    }
}
