package com.center.search.domain.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;

import java.util.Objects;

@Embeddable
@Getter
public class LocationLatitude {

    private double latitude;

    protected LocationLatitude() {
        // JPA 기본 생성자
    }

    public LocationLatitude(double latitude) {
        validate(latitude);
        this.latitude = latitude;
    }

    public static LocationLatitude create(double latitude) {
        return new LocationLatitude(latitude);
    }

    public LocationLatitude update(double newLatitude) {
        return new LocationLatitude(newLatitude);
    }

    private void validate(double latitude) {
        // 위도는 -90 ~ 90
        if (latitude < -90.0 || latitude > 90.0) {
            throw new IllegalArgumentException("Latitude must be between -90° and 90°");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LocationLatitude that)) return false;
        return Double.compare(that.latitude, latitude) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(latitude);
    }

    @Override
    public String toString() {
        return latitude + "°";
    }


}
