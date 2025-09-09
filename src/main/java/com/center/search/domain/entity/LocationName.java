package com.center.search.domain.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;

import java.util.Objects;

@Embeddable
@Getter
public class LocationName {

    private String locationName;

    protected LocationName() {
        // JPA 기본 생성자
    }

    public LocationName(String locationName) {
        if (locationName == null || locationName.trim().isBlank()) {
            throw new IllegalArgumentException("Location name cannot be null or blank");
        }
        String name = locationName.trim();
        if (name.length() > 60) {
            throw new IllegalArgumentException("Location name cannot be more than 60 characters");
        }
        this.locationName = name;
    }

    public static LocationName create(String locationName) {
        return new LocationName(locationName);
    }

    public LocationName update(String newLocationName) {
        return new LocationName(newLocationName);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LocationName that)) return false;
        return Objects.equals(locationName, that.locationName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(locationName);
    }

    @Override
    public String toString() {
        return locationName;
    }
}

