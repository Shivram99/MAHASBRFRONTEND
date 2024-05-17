package com.mahasbr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mahasbr.entity.FeedbackForm;


@Repository
public interface FeedbackFormRepository extends JpaRepository<FeedbackForm, Long>{
	
}



