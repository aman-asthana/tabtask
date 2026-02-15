package com.mednet.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.mednet.dao.PrefixDAO;
import com.mednet.model.Prefix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Service
public class PdfService {

    private final PrefixDAO dao;

    @Autowired
    public PdfService(PrefixDAO dao) {
        this.dao = dao;
    }

    public PdfService() {
        this.dao = new PrefixDAO();
    }

    public void exportPdf(HttpServletResponse response) throws IOException, DocumentException {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=prefix.pdf");

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        // Title
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.DARK_GRAY);
        Paragraph title = new Paragraph("Prefix Data Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Table
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);

        // Header
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.WHITE);
        String[] headers = {"ID", "Prefix", "Name", "Gender", "Prefix Of"};
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(BaseColor.DARK_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(8);
            table.addCell(cell);
        }

        // Data
        Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        List<Prefix> list = dao.getAll();
        System.out.println("PDF Export: Found " + list.size() + " records");

        if (list.isEmpty()) {
            // Show message if no data
            Paragraph noData = new Paragraph("No records found in database.", dataFont);
            noData.setAlignment(Element.ALIGN_CENTER);
            document.add(noData);
        } else {
            for (Prefix p : list) {
                System.out.println("Adding to PDF: " + p.getName());
                table.addCell(new PdfPCell(new Phrase(String.valueOf(p.getId()), dataFont)));
                table.addCell(new PdfPCell(new Phrase(p.getPrefix() != null ? p.getPrefix() : "", dataFont)));
                table.addCell(new PdfPCell(new Phrase(p.getName() != null ? p.getName() : "", dataFont)));
                table.addCell(new PdfPCell(new Phrase(p.getGender() != null ? p.getGender() : "", dataFont)));
                table.addCell(new PdfPCell(new Phrase(p.getRelation() != null ? p.getRelation() : "", dataFont)));
            }
            document.add(table);
        }
        document.close();
    }
}

