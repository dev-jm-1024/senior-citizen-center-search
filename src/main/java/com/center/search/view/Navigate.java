package com.center.search.view;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Navigate {

    private String start;
    private String startName;
    private String wayPoints;
    private String wayPointNames;
    private String goal;
    private String goalName;

    public Navigate() {}

    public Navigate(String start, String startName) {
        this.start = start;
        this.startName = startName;
    }

    public Navigate(String start, String startName, String wayPoints, String wayPointNames) {
        this.start = start;
        this.startName = startName;
        this.wayPoints = wayPoints;
        this.wayPointNames = wayPointNames;
    }


}
