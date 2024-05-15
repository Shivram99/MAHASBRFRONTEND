package com.mahasbr.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mahasbr.entity.DepartmentMst;
import com.mahasbr.service.DepartmentMstService;

@RestController
@RequestMapping("/departments")
public class DepartmentMstController {

	@Autowired
    private final DepartmentMstService departmentMstService;

    @Autowired
    public DepartmentMstController(DepartmentMstService departmentMstService) {
        this.departmentMstService = departmentMstService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentMst> getDepartmentById(@PathVariable("id") Long id) {
        return departmentMstService.findDepartmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<DepartmentMst> getAllDepartments() {
        return departmentMstService.findAllDepartments();
    }

    @PostMapping
    public ResponseEntity<DepartmentMst> createDepartment(@RequestBody DepartmentMst department) {
        DepartmentMst savedDepartment = departmentMstService.saveOrUpdateDepartment(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDepartment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentMst> updateDepartment(@PathVariable("id") Long id, @RequestBody DepartmentMst department) {
        if (!departmentMstService.findDepartmentById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        department.setDepartmentId(id); // Ensure the ID is set for the correct department
        DepartmentMst updatedDepartment = departmentMstService.saveOrUpdateDepartment(department);
        return ResponseEntity.ok(updatedDepartment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable("id") Long id) {
        if (!departmentMstService.findDepartmentById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        departmentMstService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
