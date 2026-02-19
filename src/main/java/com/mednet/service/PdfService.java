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
    private static final String NODE_SERVER_PATH = "D:/Oakland 7 tab/tabtask/puppeteer";

    private Process nodeProcess;

    @Autowired
    public PdfService(PrefixDAO dao, ObjectMapper objectMapper) {
        this.dao = dao;
        this.objectMapper = objectMapper;
    }

    public void exportPdf(HttpServletResponse response) throws IOException {

        // Start Node server if not running
        startNodeServer();

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

    // Start Node server using ProcessBuilder
    private void startNodeServer() {
        try {
            // Check if server is already running
            if (isServerRunning()) {
                System.out.println("✅ Node server already running");
                return;
            }

            System.out.println("🚀 Starting Node server...");

            ProcessBuilder pb = new ProcessBuilder("node", "server.js");
            pb.directory(new File(NODE_SERVER_PATH));
            pb.redirectErrorStream(true);

            nodeProcess = pb.start();

            // Wait for server to start (max 5 seconds)
            for (int i = 0; i < 10; i++) {
                Thread.sleep(500);
                if (isServerRunning()) {
                    System.out.println("✅ Node server started successfully");
                    return;
                }
            }

            System.out.println("⚠️ Node server may not have started properly");

        } catch (Exception e) {
            System.out.println("❌ Failed to start Node server: " + e.getMessage());
        }
    }

    // Check if Node server is running
    private boolean isServerRunning() {
        try {
            URL url = new URL("http://localhost:3000");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(1000);
            conn.setReadTimeout(1000);
            conn.setRequestMethod("GET");
            int responseCode = conn.getResponseCode();
            conn.disconnect();
            return responseCode == 200;
        } catch (Exception e) {
            return false;
        }
    }

    private byte[] callPuppeteerServer(String jsonData) throws IOException {
        // ...existing code...
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

