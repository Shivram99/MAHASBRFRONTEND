package com.mahasbr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.DistrictMaster;
import com.mahasbr.model.DistrictMasterModel;
import com.mahasbr.repository.DistrictMasterRepository;

@Service
public class DistrictMasterServiceImpl implements DistrictMasterService {
	@Autowired
	DistrictMasterRepository districtMasterRepository;


	@Override
	public DistrictMaster insertDistrictDetail(DistrictMaster districtMaster) {
		districtMasterRepository.save(districtMaster);
		return districtMaster;
	}

}
