package com.mahasbr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.DistrictMaster;
import com.mahasbr.repository.DistrictMasterRepository;


@Service
public interface DistrictMasterService {

	DistrictMaster insertDistrictDetail(DistrictMaster districtMaster);
	
	
	/*
	 * @Autowired DistrictMasterRepository districtMasterRepository;
	 * 
	 * public DistrictMaster insertDistrictDetail(DistrictMaster districtMaster) {
	 * DistrictMaster save = districtMasterRepository.save(districtMaster); return
	 * save; }
	 */

}
