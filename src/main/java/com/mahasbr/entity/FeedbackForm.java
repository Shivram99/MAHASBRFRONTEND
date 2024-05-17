package com.mahasbr.entity;

import com.mahasbr.model.FeedbackFormModel;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "feedback_form")
@Data
@NoArgsConstructor
public class FeedbackForm {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "feedbackform_seq_generator")
	@SequenceGenerator(name = "feedbackform_seq_generator", sequenceName = "feedbackform_seq", allocationSize = 1)
	private Long id;
	
	@NotBlank()
	@Size(max=100)
	private String name;
	
	@NotBlank
	private String districtName;
	
	@NotBlank
	@Email(message = "Please enter valid email id ", regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$")
	//^[a-zA-Z0-9_!#$%&'*+\=?`{|}~^.-]+@[a-zA-Z0-9.-]+$
	private String emailId;
	
	@NotBlank
	@Size(max=5000)
	private String textMsg;
	
	public FeedbackForm(FeedbackFormModel feedbackFormModel) {
		this.name = feedbackFormModel.getName();
		this.districtName = feedbackFormModel.getDistrictName();
		this.emailId = feedbackFormModel.getEmailId();
		this.textMsg = feedbackFormModel.getTextMsg();
	}
	
}
