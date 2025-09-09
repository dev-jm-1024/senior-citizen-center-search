package com.center.search.domain.dto;

import lombok.Data;

@Data
public class LocationCreateRequest {

    String locationName;
    String locationNumber;
    String locationAddress;

}
