package com.mahasbr.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FeedbackFormModel {
	private String name;
	private String districtName;
	private String emailId;
	private String textMsg;
}
