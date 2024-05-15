package com.mahasbr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahasbr.entity.TalukaMaster;
import com.mahasbr.model.TalukaMasterModel;
import com.mahasbr.repository.TalukaMasterRepository;

@Service
public class TalukaMasterService {
	@Autowired
	TalukaMasterRepository talukaMasterRepository;

	/*
	 * public TalukaMaster insertTalukaDetails(TalukaMasterModel talukaMasterModel)
	 * { TalukaMaster data = new TalukaMaster(talukaMasterModel);
	 * talukaMasterRepository.save(data); return data; }
	 */
}
