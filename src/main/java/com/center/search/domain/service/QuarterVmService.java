package com.center.search.domain.service;

import com.center.search.view.QuarterVM;

import java.util.List;

public interface QuarterVmService {

    List<QuarterVM> getQuarterVMs(String area);
}
