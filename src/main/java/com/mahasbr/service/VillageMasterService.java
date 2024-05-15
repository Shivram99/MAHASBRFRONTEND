package com.mahasbr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.VillageMaster;
import com.mahasbr.model.VillageMasterModel;
import com.mahasbr.repository.VillageMasterRepository;

@Service
public class VillageMasterService {
	@Autowired
	VillageMasterRepository villageMasterRepository;
	/*
	 * public VillageMaster insertVillageDetails(VillageMasterModel
	 * villageMasterModel) { VillageMaster data = new
	 * VillageMaster(villageMasterModel); villageMasterRepository.save(data); return
	 * data; }
	 */
}