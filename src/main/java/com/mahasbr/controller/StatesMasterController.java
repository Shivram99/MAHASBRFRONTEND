package com.mahasbr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mahasbr.entity.StatesMaster;
import com.mahasbr.model.StatesMasterModel;
import com.mahasbr.response.MessageResponse;
import com.mahasbr.service.StatesMasterService;

@RestController
@RequestMapping("/api/auth")
public class StatesMasterController {
	@Autowired
	StatesMasterService statesMasterService;

	/*
	 * @PostMapping("/state") public ResponseEntity<?> postStateName(@RequestBody
	 * StatesMasterModel stateMasterModel) { StatesMaster state =
	 * statesMasterService.postState(stateMasterModel); return ResponseEntity.ok(new
	 * MessageResponse("Added successfully!", state)); }
	 */

}
