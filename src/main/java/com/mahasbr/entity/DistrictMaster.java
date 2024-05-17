package com.mahasbr.entity;

import com.mahasbr.model.DistrictMasterModel;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Data
@Table(name = "district_master", uniqueConstraints = { @UniqueConstraint(columnNames = "districtId")})
public class DistrictMaster {
	@Id
	 @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "districtmaster_seq_generator")
    @SequenceGenerator(name="districtmaster_seq_generator", sequenceName = "districtmasters_seq", allocationSize=1)
	@NotBlank
	private Long districtId;

	@NotBlank
	private String districtName;
	@NotBlank
	private Integer censusDistrictCode;

	public DistrictMaster(DistrictMasterModel districtMasterModel) {
		this.districtName = districtMasterModel.getDistrictName();
		this.censusDistrictCode = districtMasterModel.getCensusDistrictCode();

	}
}
