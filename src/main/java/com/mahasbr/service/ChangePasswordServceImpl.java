package com.mahasbr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.User;
import com.mahasbr.repository.UserRepository;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class ChangePasswordServceImpl implements ChangePasswordServce{
	
	
	 @Autowired
	  UserRepository userRepository;
	



	public User updateUser(User messages) {
		  // Retrieve the user from the repository
        User user = userRepository.findById(messages.getId())
                                            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + messages.getId()));
        user.setPassword(messages.getPassword());
        return userRepository.save(user);
	}
	}


