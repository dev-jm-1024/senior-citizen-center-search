package com.center.search.domain.dto;

public record LocationMarkerDto(
        Long id,
        String name,
        String tel,
        String address,
        double lat,
        double lng
) {}
