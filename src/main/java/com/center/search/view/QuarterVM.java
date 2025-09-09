package com.center.search.view;

import com.center.search.domain.entity.LocationAddress;
import com.center.search.domain.entity.LocationName;
import com.center.search.domain.entity.LocationNumber;

public record QuarterVM(

        String SEONGNAM_S,
        String SEONGNAM_B,
        String SEONGNAM_J,
        Long locationId,
        LocationName locationName,
        LocationNumber locationNumber,
        LocationAddress locationAddress
) {
}
