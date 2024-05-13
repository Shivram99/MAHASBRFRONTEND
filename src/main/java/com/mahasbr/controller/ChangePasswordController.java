package com.mahasbr.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mahasbr.entity.User;
import com.mahasbr.model.ChangePasswordModel;
import com.mahasbr.response.MessageResponse;
import com.mahasbr.service.ChangePasswordServceImpl;
import com.mahasbr.service.CommonService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class ChangePasswordController {

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	private ChangePasswordServceImpl changePasswordServiceImpl;

	@Autowired
	CommonService commonService;

	@PostMapping("/changePassword")
	public ResponseEntity<MessageResponse> changePassword(@RequestBody ChangePasswordModel changePasswordModel,
			BindingResult bindingResult, HttpSession session) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Optional<User> optional = commonService.findByUsername(username);
		if (bindingResult.hasErrors()) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new MessageResponse("Failed to update password!"));
		}

		if (optional.isPresent()) {
			User messages = optional.get();
			if (changePasswordModel.getNewPasswordConfirm().equals(changePasswordModel.getNewPassword())) {
				String oldPass = changePasswordModel.getPassword();
				String newPass = encoder.encode(changePasswordModel.getNewPasswordConfirm());
				if (encoder.matches(oldPass, messages.getPassword())) {
					messages.setPassword((encoder.encode(changePasswordModel.getNewPasswordConfirm())));
					User message = (User) changePasswordServiceImpl.updateUser(messages);

					return ResponseEntity.status(HttpStatus.OK)
							.body(new MessageResponse("Password updated successfully!"));

				} else {
					return ResponseEntity.status(HttpStatus.CONFLICT)
							.body(new MessageResponse("Old Password does not match!"));
				}

			}
		} else {
			return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Failed to update password !"));
		}
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new MessageResponse("Failed to update password!"));

	}

}
