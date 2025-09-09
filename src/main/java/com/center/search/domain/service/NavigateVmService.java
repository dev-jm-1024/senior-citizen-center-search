package com.center.search.domain.service;

import com.center.search.view.Navigate;

public interface NavigateVmService {

    Navigate getStartData(String start, String startName);

    Navigate getStartAndWaypointsData(String start, String startName, String waypoints, String waypointsName);

    Navigate getResultData();
}
