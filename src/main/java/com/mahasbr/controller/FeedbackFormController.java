package com.mahasbr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mahasbr.entity.FeedbackForm;
import com.mahasbr.model.FeedbackFormModel;
import com.mahasbr.response.MessageResponse;
import com.mahasbr.service.FeedbackFormService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/user")
public class FeedbackFormController {
	@Autowired
	FeedbackFormService feddbackFeedbackFormService;

	@PostMapping("/feedbackForm")
	public ResponseEntity<?> getFeedbackFormDetails(@Valid @RequestBody FeedbackFormModel feedbackFormModel) {
		FeedbackForm details = feddbackFeedbackFormService.getFeedbackFormDetails(feedbackFormModel);
        return new ResponseEntity<>(new MessageResponse("Feedback submitted successfully", details), HttpStatus.ACCEPTED);
	}

}
