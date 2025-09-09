package com.center.search.domain.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;

import java.util.Objects;

@Embeddable
@Getter
public class LocationAddress {

    private String address;

    protected LocationAddress() {

    }

    public LocationAddress(String address) {
        if (address == null || address.trim().isBlank()) {
            throw new IllegalArgumentException("Address cannot be null or blank");
        }
        String value = address.trim();
        if (value.length() > 200) {
            throw new IllegalArgumentException("Address cannot be more than 200 characters");
        }
        this.address = value;
    }


    public static LocationAddress create(String address) {
        return new LocationAddress(address);
    }


    public LocationAddress update(String newAddress) {
        return new LocationAddress(newAddress);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LocationAddress that)) return false;
        return Objects.equals(address, that.address);
    }

    @Override
    public int hashCode() {
        return Objects.hash(address);
    }

    @Override
    public String toString() {
        return address;
    }
}
