package com.mahasbr.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.DepartmentMst;
import com.mahasbr.repository.DepartmentMstRepository;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class DepartmentMstServiceImpl implements DepartmentMstService {

    private final DepartmentMstRepository departmentMstRepository;

    @Autowired
    public DepartmentMstServiceImpl(DepartmentMstRepository departmentMstRepository) {
        this.departmentMstRepository = departmentMstRepository;
    }

    @Override
    public DepartmentMst saveOrUpdateDepartment(DepartmentMst department) {
        return departmentMstRepository.save(department);
    }

    @Override
    public Optional<DepartmentMst> findDepartmentById(Long id) {
        return departmentMstRepository.findById(id);
    }

    @Override
    public List<DepartmentMst> findAllDepartments() {
        return departmentMstRepository.findAll();
    }

    @Override
    public void deleteDepartment(Long id) {
        departmentMstRepository.deleteById(id);
    }
}
