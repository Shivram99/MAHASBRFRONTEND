package com.mahasbr.service;

import java.util.List;
import java.util.Optional;


import com.mahasbr.entity.DepartmentMst;

public interface DepartmentMstService {

	DepartmentMst saveOrUpdateDepartment(DepartmentMst department);

	Optional<DepartmentMst> findDepartmentById(Long id);

	List<DepartmentMst> findAllDepartments();

	void deleteDepartment(Long id);
}
