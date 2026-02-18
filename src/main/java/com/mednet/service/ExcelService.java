package com.mednet.service;

import com.mednet.dao.PrefixDAO;
import com.mednet.model.Prefix;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
@Transactional
public class ExcelService {

    private final PrefixDAO dao;

    @Autowired
    public ExcelService(PrefixDAO dao) {
        this.dao = dao;
    }

    public void exportExcel(HttpServletResponse response, boolean isTemplate) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Prefix Data");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Prefix");
        header.createCell(1).setCellValue("Name");
        header.createCell(2).setCellValue("Gender");
        header.createCell(3).setCellValue("Relation");

        if (!isTemplate) {
            List<Prefix> list = dao.getAll();
            int rowNum = 1;
            for (Prefix p : list) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(p.getPrefix());
                row.createCell(1).setCellValue(p.getName());
                row.createCell(2).setCellValue(p.getGender());
                row.createCell(3).setCellValue(p.getRelation());
            }
        }

        response.setContentType(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=prefix.xlsx"
        );

        workbook.write(response.getOutputStream());
        workbook.close();
    }

    public String uploadExcel(InputStream inputStream) throws IOException {
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0);
        int count = 0;

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row != null && row.getCell(0) != null && row.getCell(1) != null) {
                Prefix p = new Prefix();
                p.setPrefix(row.getCell(0).getStringCellValue());
                p.setName(row.getCell(1).getStringCellValue());
                p.setGender(row.getCell(2) != null ? row.getCell(2).getStringCellValue() : "");
                p.setRelation(row.getCell(3) != null ? row.getCell(3).getStringCellValue() : "");
                dao.save(p);
                count++;
            }
        }
        workbook.close();
        return count + " records uploaded successfully";
    }
}
