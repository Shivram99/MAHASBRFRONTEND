package com.mahasbr.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class VillageMasterModel {
	
	@NotBlank
	@Size(max = 100)
	private String villageName;
	
	@NotBlank
	@Size(max = 10)
	private Integer censusVillageCode;
	
	
}

