package com.mahasbr.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mahasbr.entity.DistrictMaster;
import com.mahasbr.repository.DistrictMasterRepository;
import com.mahasbr.response.MessageResponse;
import com.mahasbr.service.DistrictMasterService;

@RestController
@RequestMapping("/api/auth")
public class DistrictMasterController {
	@Autowired
	DistrictMasterService districtMasterService;
	
	
	@Autowired
	DistrictMasterRepository districtMasterRepository;
	
	private static final Logger logger = LoggerFactory.getLogger(DistrictMasterController.class);
	private static final String CSV_FILE_LOCATION = "\\MAHASBR\\target\\Book3.xlsx";
	
	@PostMapping("/district")
	public ResponseEntity<?> postDistrictDetails(@RequestBody DistrictMaster districtMaster) {
		DistrictMaster district = districtMasterService.insertDistrictDetail(districtMaster);
		return ResponseEntity.ok(new MessageResponse("Added successfully!", district));
	}

	@GetMapping
	public @ResponseBody void readCSV() {
		
		List<DistrictMaster> districts = new ArrayList<>();
		Workbook workbook = null;
		Set<Integer> districtCodes = new HashSet<>(); // Set to store unique district codes
		try {
			workbook = WorkbookFactory.create(new File(CSV_FILE_LOCATION));

			// Retrieving the number of sheets in the Workbook
			logger.info("Number of sheets: ", workbook.getNumberOfSheets());
			// Print all sheets name
			workbook.forEach(sheet -> {
				logger.info(" => " + sheet.getSheetName());

				// Create a DataFormatter to format and get each cell's value as String
				DataFormatter dataFormatter = new DataFormatter();
				// loop through all rows and columns and create Course object
				int index = 0;
				for (Row row : sheet) {
					DistrictMaster district = new DistrictMaster();
					district.setCensusDistrictCode(Long.parseLong(dataFormatter.formatCellValue(row.getCell(1))));
					district.setDistrictName(dataFormatter.formatCellValue(row.getCell(2)));

					// Check if district code is already in set, if not add to list and set
					if (!districtCodes.contains(district.getCensusDistrictCode())) {
						districts.add(district);
					//	districtCodes.add(district.getCensusDistrictCode());
				}
				//	DistrictMaster data = new DistrictMaster(district);
				districtMasterRepository.saveAll(districts);
				}

			});

		} catch (EncryptedDocumentException | InvalidFormatException | IOException e) {
			logger.error(e.getMessage(), e);
		} finally {
			try {
				if (workbook != null)
					workbook.close();
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			}
		}

		//return districts;
	}
}
