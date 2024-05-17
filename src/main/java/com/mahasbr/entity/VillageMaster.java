package com.mahasbr.entity;

import com.mahasbr.model.VillageMasterModel;

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
@Table(name = "village_master", uniqueConstraints = { @UniqueConstraint(columnNames = "villageId") })
public class VillageMaster {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "villagemaster_seq_generator")
	@SequenceGenerator(name = "villagemaster_seq_generator", sequenceName = "villagemasters_seq", allocationSize = 1)
	@NotBlank
	private Long villageId;

	@NotBlank
	private String villageName;
	@NotBlank
	private Integer censusVillageCode;

	public VillageMaster(VillageMasterModel villageMasterModel) {
		this.villageName = villageMasterModel.getVillageName();
		this.censusVillageCode = villageMasterModel.getCensusVillageCode();

	}
}
