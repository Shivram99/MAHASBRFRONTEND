package com.mahasbr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mahasbr.entity.DistrictMaster;
import com.mahasbr.model.DistrictMasterModel;
import com.mahasbr.response.MessageResponse;
import com.mahasbr.service.DistrictMasterService;


@RestController
@RequestMapping("/api/auth")
public class DistrictMasterController {
	@Autowired
	DistrictMasterService districtMasterService;

	@PostMapping("/district")
	public ResponseEntity<?> postDistrictDetails(@RequestBody DistrictMasterModel districtMasterModel) {
		DistrictMaster district = districtMasterService.insertDistrictDetail(districtMasterModel);
		return ResponseEntity.ok(new MessageResponse("Added successfully!", district));
	}
}
