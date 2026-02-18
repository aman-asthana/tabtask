package com.mednet.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mednet.dao.PrefixDAO;
import com.mednet.model.Prefix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class PdfService {

    private final PrefixDAO dao;
    private final ObjectMapper objectMapper;

    private static final String PUPPETEER_URL = "http://localhost:3000/pdf";

    @Autowired
    public PdfService(PrefixDAO dao, ObjectMapper objectMapper) {
        this.dao = dao;
        this.objectMapper = objectMapper;
    }

    public void exportPdf(HttpServletResponse response) throws IOException {

        response.setContentType("application/pdf");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=prefix-report.pdf"
        );

        // DB call (safe now)
        List<Prefix> prefixList = dao.getAll();

        String jsonData = objectMapper.writeValueAsString(prefixList);
        byte[] pdfBytes = callPuppeteerServer(jsonData);

        response.setContentLength(pdfBytes.length);
        try (OutputStream out = response.getOutputStream()) {
            out.write(pdfBytes);
        }
    }

    private byte[] callPuppeteerServer(String jsonData) throws IOException {
        URL url = new URL(PUPPETEER_URL);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        connection.setConnectTimeout(30000);
        connection.setReadTimeout(30000);

        try (OutputStream os = connection.getOutputStream()) {
            os.write(jsonData.getBytes(StandardCharsets.UTF_8));
        }

        if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
            throw new IOException("Puppeteer server error: " + connection.getResponseCode());
        }

        try (InputStream is = connection.getInputStream();
             ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

            byte[] data = new byte[4096];
            int n;
            while ((n = is.read(data)) != -1) {
                buffer.write(data, 0, n);
            }
            return buffer.toByteArray();
        } finally {
            connection.disconnect();
        }
    }
}

