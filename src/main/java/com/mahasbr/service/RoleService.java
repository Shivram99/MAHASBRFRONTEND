package com.mahasbr.service;
import com.mahasbr.entity.Role;

import java.util.List;
import java.util.Optional;

public interface RoleService {

    List<Role> getAllRoles();

	void deleteRole(Long id);

	Optional<Role> findRoleById(Long id);

	Role saveOrUpdateRole(Role role);
    
    
}