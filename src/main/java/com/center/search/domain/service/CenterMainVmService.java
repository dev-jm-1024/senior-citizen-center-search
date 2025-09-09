package com.center.search.domain.service;

import com.center.search.domain.entity.Location;
import com.center.search.view.CenterMainVM;

import java.util.List;
import java.util.Map;

public interface CenterMainVmService {

    Map<String, List<CenterMainVM>> getCenterMainVMs();
}
