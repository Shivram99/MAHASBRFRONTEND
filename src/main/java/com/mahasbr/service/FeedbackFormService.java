package com.mahasbr.service;

import com.mahasbr.entity.FeedbackForm;
import com.mahasbr.model.FeedbackFormModel;

import jakarta.validation.Valid;

 public interface FeedbackFormService {

	public FeedbackForm getFeedbackFormDetails(@Valid FeedbackFormModel feedbackFormModel);

}
