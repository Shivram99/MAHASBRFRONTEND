package com.mahasbr.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor  
@Table(name = "district_master")
public class DistrictMaster  extends Auditable{
	
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "district_master_seq_generator")
    @SequenceGenerator(name="district_master_seq_generator", sequenceName = "district_seq", allocationSize=1)
	@NotBlank
	private Long censusDistrictCode;
	

	@NotBlank
	private String districtName;
	
	
	@NotBlank
	private Long censusStateCode;
	
	
	
}
