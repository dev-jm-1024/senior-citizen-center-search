package com.center.search.domain.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;

import java.util.Objects;

@Embeddable
@Getter
public class LocationLongitude {

    private double longitude;

    protected LocationLongitude() {
        // JPA 기본 생성자
    }

    public LocationLongitude(double longitude) {
        validate(longitude);
        this.longitude = longitude;
    }

    public static LocationLongitude create(double longitude) {
        return new LocationLongitude(longitude);
    }

    public LocationLongitude update(double newLongitude) {
        return new LocationLongitude(newLongitude);
    }

    private void validate(double longitude) {
        // 경도는 -180 ~ 180
        if (longitude < -180.0 || longitude > 180.0) {
            throw new IllegalArgumentException("Longitude must be between -180° and 180°");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LocationLongitude that)) return false;
        return Double.compare(that.longitude, longitude) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(longitude);
    }

    @Override
    public String toString() {
        return longitude + "°";
    }
}
