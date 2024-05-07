package com.mahasbr.response;

import com.mahasbr.entity.DistrictMaster;
import com.mahasbr.entity.StatesMaster;
import com.mahasbr.entity.TalukaMaster;
import com.mahasbr.entity.VillageMaster;

public class MessageResponse {
	private String message;
	private Object object;

	public Object getObject() {
		return object;
	}

	public void setObject(Object object) {
		this.object = object;
	}

	public MessageResponse(String message) {
		this.message = message;
	}

	public MessageResponse(String message, StatesMaster state) {
		this.message = message;
		this.object = state;
	}
	public MessageResponse(String message, DistrictMaster district) {
		this.message = message;
		this.object = district;
	}
	public MessageResponse(String message, TalukaMaster taluka) {
		this.message = message;
		this.object = taluka;
	}
	public MessageResponse(String message, VillageMaster village) {
		this.message = message;
		this.object = village;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}