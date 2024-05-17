package com.mahasbr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.StatesMaster;
import com.mahasbr.model.StatesMasterModel;
import com.mahasbr.repository.StatesMasterRepository;

@Service
public class StatesMasterService {
	@Autowired
	StatesMasterRepository statesMasterRepository;
	
   public StatesMaster postState(StatesMasterModel stateMasterModel) {
		StatesMaster data = new StatesMaster(stateMasterModel);
		statesMasterRepository.save(data);
		return data;
	}
}
