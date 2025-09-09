package com.center.search.domain.repo;

import com.center.search.domain.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LocationRepo extends JpaRepository <Location, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE Location loc SET loc.status = :status WHERE loc.id = :id")
    int updateLocationStatus( @Param("status") int status, @Param("id") Long id);

    // LocationRepo에 추가
    List<Location> findAllByIdInAndStatus(List<Long> ids, int status);

    // 통합 검색 - 실제 필드명에 맞게 수정
    @Query("SELECT l FROM Location l WHERE l.status = :status " +
            "AND (l.locationName.locationName LIKE %:keyword% OR l.locationAddress.address LIKE %:keyword%) " +
            "ORDER BY " +
            "CASE " +
            "  WHEN l.locationName.locationName LIKE :keyword% THEN 1 " +
            "  WHEN l.locationName.locationName LIKE %:keyword% THEN 2 " +
            "  WHEN l.locationAddress.address LIKE %:keyword% THEN 3 " +
            "  ELSE 4 " +
            "END, l.locationName.locationName")
    List<Location> searchByKeyword(@Param("keyword") String keyword, @Param("status") int status);

    // 이름으로만 검색
    @Query("SELECT l FROM Location l WHERE l.status = :status " +
            "AND l.locationName.locationName LIKE %:keyword% " +
            "ORDER BY l.locationName.locationName")
    List<Location> searchByName(@Param("keyword") String keyword, @Param("status") int status);

    // 주소로만 검색
    @Query("SELECT l FROM Location l WHERE l.status = :status " +
            "AND l.locationAddress.address LIKE %:keyword% " +
            "ORDER BY l.locationAddress.address")
    List<Location> searchByAddress(@Param("keyword") String keyword, @Param("status") int status);

}
