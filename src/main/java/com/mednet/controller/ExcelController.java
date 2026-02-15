package com.mednet.controller;

import com.mednet.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/excel")
public class ExcelController {

    private final ExcelService excelService;

    @Autowired
    public ExcelController(ExcelService excelService) {
        this.excelService = excelService;
    }

    @GetMapping("/export")
    public void exportExcel(@RequestParam(value = "type", required = false) String type,
                            HttpServletResponse response) throws IOException {
        boolean isTemplate = "template".equalsIgnoreCase(type);
        excelService.exportExcel(response, isTemplate);
    }

    @PostMapping("/upload")
    public String uploadExcel(@RequestParam("file") MultipartFile file) throws IOException {
        return excelService.uploadExcel(file.getInputStream());
    }
}

