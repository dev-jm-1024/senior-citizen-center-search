package com.center.search.domain.service;

import com.center.search.view.CenterLocateVM;

import java.util.List;
import java.util.Map;

public interface CenterLocateService {

    List<CenterLocateVM> getCenterLocate();

    Map<String, List<CenterLocateVM>> getCenterLocateGroup();

    List<CenterLocateVM> getSelectedCenterLocates(List<Long> ids);
}
