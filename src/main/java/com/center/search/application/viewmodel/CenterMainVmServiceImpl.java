package com.center.search.application.viewmodel;

import com.center.search.domain.entity.Location;
import com.center.search.domain.service.CenterMainVmService;
import com.center.search.domain.service.LocationService;
import com.center.search.view.CenterMainVM;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.center.search.common.SeongnamArea.SEONGNAM_ARR;

@Service
public class CenterMainVmServiceImpl implements CenterMainVmService {

    private final LocationService locationService;

    public CenterMainVmServiceImpl(LocationService locationService) {
        this.locationService = locationService;
    }

    @Override
    public Map<String, List<CenterMainVM>> getCenterMainVMs() {

        Map<String, List<CenterMainVM>> result = new HashMap<>();

        for (String seongnam : SEONGNAM_ARR) {
            List<Location> locations = locationService.findAllLocations();

            if (locations.isEmpty()) {
                result.put(seongnam, Collections.emptyList());
                continue;
            }

            List<CenterMainVM> vms = locations.stream()
                    .filter(Location::isActivate)
                    .filter(loc -> loc.getLocationAddress().getAddress().contains(seongnam))
                    .map(loc -> new CenterMainVM(
                            loc.getId(),
                            loc.getLocationName(),
                            loc.getLocationNumber(),
                            loc.getLocationAddress()
                    ))
                    .limit(5)
                    .collect(Collectors.toList());

            result.put(seongnam, vms);
        }

        return result.isEmpty() ? Collections.emptyMap() : result;
    }

}
