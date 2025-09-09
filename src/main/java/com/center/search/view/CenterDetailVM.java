package com.center.search.view;

import com.center.search.domain.entity.*;

public record CenterDetailVM(
        Long locationId,
        LocationName locationName,
        LocationNumber locationNumber,
        LocationAddress locationAddress,
        LocationLatitude latitude,
        LocationLongitude longitude
) {
}
