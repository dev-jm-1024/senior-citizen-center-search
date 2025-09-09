package com.center.search.domain.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Embeddable
@Getter
public class LocationNumber {

    private String locationNumber;

    public LocationNumber() {}

    public LocationNumber(String locationNumber) {
        if (locationNumber == null || locationNumber.trim().isBlank()) {
            throw new IllegalArgumentException("Location number cannot be null or blank");
        }
        String name = locationNumber.trim();
        if (name.length() > 60) {
            throw new IllegalArgumentException("Location number cannot be more than 60 characters");
        }
        this.locationNumber = name;
    }

    public static LocationNumber createLocationNumber(String locationNumber) {
        return new LocationNumber(locationNumber);
    }

    public static LocationNumber update(String newLocationNumber) {
        return new LocationNumber(newLocationNumber);
    }

    // 수정 필요
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;  // 이 라인 추가 필요
        if (o == null || getClass() != o.getClass()) return false;
        LocationNumber that = (LocationNumber) o;
        return Objects.equals(locationNumber, that.locationNumber);
    }


    @Override
    public int hashCode() {
        return Objects.hashCode(locationNumber);
    }

    @Override
    public String toString() {
        return locationNumber;
    }
}
