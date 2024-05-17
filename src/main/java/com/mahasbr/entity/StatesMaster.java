package com.mahasbr.entity;

import com.mahasbr.model.StatesMasterModel;

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
@Table(name = "state_master", uniqueConstraints = { @UniqueConstraint(columnNames = "stateId") })
public class StatesMaster {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "statemaster_seq_generator")
	@SequenceGenerator(name = "statemaster_seq_generator", sequenceName = "statemasters_seq", allocationSize = 1)
	@NotBlank
	private Long stateId;

	@NotBlank
	private String stateName;
	@NotBlank
	private Integer censusStateCode;

	public StatesMaster(StatesMasterModel stateMasterModel) {
		this.stateName = stateMasterModel.getStateName();
		this.censusStateCode = stateMasterModel.getCensusStateCode();

	}

}
