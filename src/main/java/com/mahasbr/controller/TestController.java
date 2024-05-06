package com.mahasbr.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


//@CrossOrigin(origins = "*", maxAge = 3600)
//@RestController
//@RequestMapping("/api/auth")
public class TestController {
	/*

	
	   @GetMapping(value = "/secured", produces = MediaType.APPLICATION_JSON_VALUE)
	    public ResponseEntity<String> secured() {
	        return new ResponseEntity<>("{\"msg\":\"Hello secure World\"}", HttpStatus.OK);
	    }

	    @PreAuthorize("hasAnyRole('ADMIN')")
	    @GetMapping(value = "/secured-admin", produces = MediaType.APPLICATION_JSON_VALUE)
	    public ResponseEntity<String> securedForAdmin() {
	        return new ResponseEntity<>("{\"msg\":\"Hello admin\"}", HttpStatus.OK);
	    }


	    @GetMapping(value = "/unsecured", produces = MediaType.APPLICATION_JSON_VALUE)
	    public ResponseEntity<String> unsecured() {
	        return new ResponseEntity<>("{\"msg\":\"Hello unsecure World\"}", HttpStatus.OK);
	    }*/
}
