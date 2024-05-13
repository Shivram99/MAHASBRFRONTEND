package com.mahasbr.model;

import jakarta.validation.constraints.NotEmpty;

public class ChangePasswordModel {
	
	@NotEmpty
	private String newPassword;
	@NotEmpty
	private String newPasswordConfirm;
	
	@NotEmpty
	private String password;

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public String getNewPasswordConfirm() {
		return newPasswordConfirm;
	}

	public void setNewPasswordConfirm(String newPasswordConfirm) {
		this.newPasswordConfirm = newPasswordConfirm;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	

}
