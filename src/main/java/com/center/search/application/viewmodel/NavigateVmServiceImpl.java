package com.center.search.application.viewmodel;

import com.center.search.domain.service.NavigateVmService;
import com.center.search.view.Navigate;
import org.springframework.stereotype.Service;

@Service
public class NavigateVmServiceImpl implements NavigateVmService {

    @Override
    public Navigate getStartData(String start, String startName) {

        return new Navigate(start, startName);
    }

    @Override
    public Navigate getStartAndWaypointsData(String start, String startName, String waypoints, String waypointsName) {
        return new Navigate(start, startName, waypoints, waypointsName);
    }

    @Override
    public Navigate getResultData() {
        return null;
    }
}
