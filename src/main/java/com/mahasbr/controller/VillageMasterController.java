package com.mahasbr.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
import com.mahasbr.entity.VillageMaster;
import com.mahasbr.model.VillageMasterModel;
import com.mahasbr.repository.VillageMasterRepository;
import com.mahasbr.response.MessageResponse;
import com.mahasbr.service.VillageMasterService;


@RestController
@RequestMapping("/api/auth")
public class VillageMasterController {
	@Autowired
	VillageMasterService villageMasterService;
	@Autowired
	VillageMasterRepository villageMasterRepository;
	
	private static final Logger logger = LoggerFactory.getLogger(VillageMasterController.class);
	private static final String CSV_FILE_LOCATION = "\\MAHASBR\\target\\Book3.xlsx";

	/*
	 * @PostMapping("/village") public ResponseEntity<?>
	 * postVillageDetails(@RequestBody VillageMasterModel villageMasterModel) {
	 * VillageMaster village =
	 * villageMasterService.insertVillageDetails(villageMasterModel); return
	 * ResponseEntity.ok(new MessageResponse("Added successfully!", village)); }
	 */
	
	

	@GetMapping("/{talukaCode}")
	public @ResponseBody void  getVillageDetails(@PathVariable String talukaCode) {
		List<VillageMaster> villages = new ArrayList<>();
		Workbook workbook = null;
		try {
			// Creating a Workbook from an Excel file (.xls or .xlsx)
			workbook = WorkbookFactory.create(new File(CSV_FILE_LOCATION));

			// Retrieving the number of sheets in the Workbook
			logger.info("Number of sheets: ", workbook.getNumberOfSheets());
			// Print all sheets name
			workbook.forEach(sheet -> {
				logger.info(" => " + sheet.getSheetName());

				DataFormatter dataFormatter = new DataFormatter();

				for (Row row : sheet) {
					Cell cell = row.getCell(3);
					String cellValue = dataFormatter.formatCellValue(cell);


						VillageMaster village = new VillageMaster();
						village.setCensusVillageCode(Integer.parseInt(dataFormatter.formatCellValue(row.getCell(2))));
						village.setVillageName(dataFormatter.formatCellValue(row.getCell(3)));
						//village
						villages.add(village);
					
					}
				villageMasterRepository.saveAll(villages);
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

		//return villages;
	}}

