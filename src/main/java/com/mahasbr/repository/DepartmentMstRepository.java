package com.mahasbr.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mahasbr.entity.DepartmentMst;

@Repository
public interface DepartmentMstRepository extends JpaRepository<DepartmentMst, Long> {
    // You can add custom query methods here if needed
}