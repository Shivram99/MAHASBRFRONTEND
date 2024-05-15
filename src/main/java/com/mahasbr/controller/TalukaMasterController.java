package com.mahasbr.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.mahasbr.entity.TalukaMaster;
import com.mahasbr.model.TalukaMasterModel;
import com.mahasbr.repository.TalukaMasterRepository;
import com.mahasbr.response.MessageResponse;
import com.mahasbr.service.TalukaMasterService;

@RestController
@RequestMapping("/api/auth")
public class TalukaMasterController {
	@Autowired
	TalukaMasterService talukaMasterService;
	@Autowired
	TalukaMasterRepository talukaMasterRepository;

	private static final Logger logger = LoggerFactory.getLogger(TalukaMasterController.class);
	private static final String CSV_FILE_LOCATION = "\\MAHASBR\\target\\Book3.xlsx";

	/*
	 * @PostMapping("/taluka") public ResponseEntity<MessageResponse>
	 * postMethodName(@RequestBody TalukaMasterModel talukaMasterModel) {
	 * TalukaMaster taluka =
	 * talukaMasterService.insertTalukaDetails(talukaMasterModel); return
	 * ResponseEntity.ok(new MessageResponse("Added successfully!", taluka));
	 * 
	 * }
	 */
	@GetMapping("/{districtCode}")
	public @ResponseBody void getDistrictDetails(@PathVariable String districtCode) {
		List<TalukaMaster> talukas = new ArrayList<>();
		Workbook workbook = null;
		Set<Integer> talukaCodes = new HashSet<>(); // Set to store unique taluka
		// codes
		// Set<String> districtCodes = new HashSet<>(); // Set to store unique district
		// codes
		try {
			// Creating a Workbook from an Excel file (.xls or .xlsx)
			workbook = WorkbookFactory.create(new File(CSV_FILE_LOCATION));

			// Retrieving the number of sheets in the Workbook
			logger.info("Number of sheets: ", workbook.getNumberOfSheets());
			// Print all sheets name
			workbook.forEach(sheet -> {
				logger.info(" => " + sheet.getSheetName());

				// Create a DataFormatter to format and get each cell's value as String
				DataFormatter dataFormatter = new DataFormatter();
				// loop through all rows and columns and create Course object
				for (Row row : sheet) {
					// if(index++ == 0) continue;
					Cell cell = row.getCell(1);
					String cellValue = dataFormatter.formatCellValue(cell);
					if (cellValue.equals(districtCode)) {

						TalukaMaster taluka = new TalukaMaster();

						taluka.setCensusTalukaCode(Long.parseLong(dataFormatter.formatCellValue(row.getCell(2))));
						taluka.setTalukaName(dataFormatter.formatCellValue(row.getCell(3)));
						taluka.setCensusTalukaCode(Long.parseLong(dataFormatter.formatCellValue(row.getCell(1))));
						
						talukas.add(taluka);
						
						talukaMasterRepository.saveAll(talukas);
					}
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

	}
}
