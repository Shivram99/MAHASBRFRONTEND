package com.mahasbr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.FeedbackForm;
import com.mahasbr.model.FeedbackFormModel;
import com.mahasbr.repository.FeedbackFormRepository;
import com.mahasbr.util.EmailSenderService;

import jakarta.validation.Valid;

@Service
public class FeedbackFormServiceImpl implements FeedbackFormService {
	@Autowired
	FeedbackFormRepository feedbackFormRepository;
	@Autowired
	EmailSenderService emailSender;

	@Override
	public FeedbackForm getFeedbackFormDetails(@Valid FeedbackFormModel feedbackFormModel) {
		FeedbackForm details = new FeedbackForm(feedbackFormModel);
		feedbackFormRepository.save(details);
		emailSender.sendEmail(details.getEmailId(), "About Registration",
				"Registration Successful!☑️ \n here is your feedback: " + details);
		return details;
	}

}
