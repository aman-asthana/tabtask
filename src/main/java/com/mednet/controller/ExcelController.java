package com.mednet.controller;

import com.mednet.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

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
    public Map<String, Object> uploadExcel(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        try {
            String result = excelService.uploadExcel(file.getInputStream());
            response.put("success", true);
            response.put("message", result);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Upload failed: " + e.getMessage());
        }
        return response;
    }
}

