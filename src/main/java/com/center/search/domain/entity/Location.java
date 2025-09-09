package com.center.search.domain.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="location")
public class Location {

    public static final int STATUS_ACTIVE = 1;
    public static final int STATUS_INACTIVE = 0;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocationNumber locationNumber;
    private LocationName locationName; //얘 010-XXXX-XXXX 로 처리
    private LocationAddress locationAddress;

    //위도
    private LocationLatitude latitude;
    //경도
    private LocationLongitude longitude;

    private int status;

    public Location() {}

    @Builder
    public Location(LocationNumber locationNumber, LocationName locationName,
                    LocationAddress locationAddress, LocationLatitude latitude,
                    LocationLongitude longitude, int status) {

        if (locationNumber == null) throw new IllegalArgumentException("LocationNumber cannot be null");
        if (locationName == null) throw new IllegalArgumentException("LocationName cannot be null");
        if (locationAddress == null) throw new IllegalArgumentException("LocationAddress cannot be null");
        if (latitude == null) throw new IllegalArgumentException("LocationLatitude cannot be null");
        if (longitude == null) throw new IllegalArgumentException("LocationLongitude cannot be null");

        this.locationNumber = locationNumber;
        this.locationName = locationName;
        this.locationAddress = locationAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
    }

    // Location 엔티티에 추가
    public Location updateWith(LocationNumber newLocationNumber,
                               LocationName newLocationName,
                               LocationAddress newLocationAddress,
                               LocationLatitude newLatitude,
                               LocationLongitude newLongitude) {
        this.locationNumber = newLocationNumber;
        this.locationName = newLocationName;
        this.locationAddress = newLocationAddress;
        this.latitude = newLatitude;
        this.longitude = newLongitude;
        return this;
    }

    public boolean isActivate(){
        return this.status == 1;
    }
}
