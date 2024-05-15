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
@Table(name = "village_master")
public class VillageMaster extends Auditable{
	
	@Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "village_master_seq_generator")
    @SequenceGenerator(name="village_master_seq_generator", sequenceName = "village_seq", allocationSize=1)
	@NotBlank
	private Integer censusVillageCode;
	

	@NotBlank
	private String villageName;
	
	
	@NotBlank
	private Long censusTalukaCode;
	
}
