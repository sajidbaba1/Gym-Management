package com.gym.management.controller;

import com.gym.management.service.GeminiService;
import com.gym.management.service.RevenueService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/revenue")
@RequiredArgsConstructor
public class RevenueController {

    private final RevenueService revenueService;
    private final GeminiService geminiService;

    @GetMapping("/data")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getRevenueData() {
        return ResponseEntity.ok(revenueService.getDetailedRevenue());
    }

    @GetMapping("/download-report")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<byte[]> downloadReport() {
        Map<String, Object> data = revenueService.getDetailedRevenue();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Revenue Analysis Report - Gym Management HQ").setFontSize(20).setBold());
            document.add(new Paragraph("Generated on: " + java.time.LocalDateTime.now()));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("SUMMARY STATISTICS").setBold());
            document.add(new Paragraph("Total Training Volume: ₹" + data.get("totalVolume")));
            document.add(new Paragraph("Total HQ Commission (15%): ₹" + data.get("totalCommission")));
            document.add(new Paragraph("Total Successful Bookings: " + data.get("totalBookings")));

            document.add(new Paragraph("\nMONTHLY BREAKDOWN (COMMISSION)").setBold());
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> monthly = (List<Map<String, Object>>) data.get("monthlyRevenue");
            if (monthly != null) {
                for (Map<String, Object> m : monthly) {
                    document.add(new Paragraph(m.get("month") + ": ₹" + m.get("revenue")));
                }
            }

            document.add(new Paragraph("\nREVENUE BY TRAINING TYPE").setBold());
            @SuppressWarnings("unchecked")
            Map<String, Double> typeRev = (Map<String, Double>) data.get("typeRevenue");
            if (typeRev != null) {
                typeRev.forEach((type, rev) -> {
                    document.add(new Paragraph(type + ": ₹" + String.format("%.2f", rev)));
                });
            }

            document.add(new Paragraph("\n\n(End of Official Report)"));
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=revenue_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(out.toByteArray());
    }

    @PostMapping("/analyze")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> analyzeReport(@RequestBody Map<String, String> payload) {
        String reportData = payload.get("reportData");
        String question = payload.get("question");
        String analysis = geminiService.analyzeReport(reportData, question);

        Map<String, String> response = new HashMap<>();
        response.put("analysis", analysis);
        return ResponseEntity.ok(response);
    }
}
