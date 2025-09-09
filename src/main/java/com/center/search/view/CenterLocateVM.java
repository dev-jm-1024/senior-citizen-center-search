package com.center.search.view;

import com.center.search.domain.entity.*;

public record CenterLocateVM(
        Long locationId,
        LocationName locationName,
        LocationAddress locationAddress,
        LocationLatitude latitude,
        LocationLongitude longitude
) {
}
