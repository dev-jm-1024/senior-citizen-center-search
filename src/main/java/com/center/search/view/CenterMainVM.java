package com.center.search.view;

import com.center.search.domain.entity.LocationAddress;
import com.center.search.domain.entity.LocationName;
import com.center.search.domain.entity.LocationNumber;

public record CenterMainVM(
        Long locationId,
        LocationName locationName,
        LocationNumber locationNumber,
        LocationAddress locationAddress
) {
}
