package com.mahasbr.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StatesMasterModel {
	
	@NotBlank
	@Size(max = 100)
	private String stateName;
	@NotBlank
	@Size(max = 10)
	private Integer censusStateCode;
	
}
