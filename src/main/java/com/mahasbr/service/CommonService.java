package com.mahasbr.service;

import java.util.Optional;

import com.mahasbr.entity.User;

public interface CommonService {
	
	 public Optional<User> findByUsername(String username);

}
