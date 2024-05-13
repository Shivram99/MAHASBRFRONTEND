package com.mahasbr.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.User;
import com.mahasbr.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CommonServiceImpl implements CommonService{
	
	@Autowired
	UserRepository userRepository;
	
	

	@Override
	public Optional<User> findByUsername(String username) {
		 Optional<User> user = userRepository.findByUsername(username);
		return user;
	}

}
