const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

// Generate PDF from prefix data
app.post('/pdf', async (req, res) => {
    try {
        const prefixData = req.body || [];

        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Generate HTML table from prefix data
        let tableRows = '';
        if (prefixData.length === 0) {
            tableRows = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No records found in database.</td></tr>';
        } else {
            prefixData.forEach(item => {
                tableRows += `
                    <tr>
                        <td>${item.id || ''}</td>
                        <td>${item.prefix || ''}</td>
                        <td>${item.name || ''}</td>
                        <td>${item.gender || ''}</td>
                        <td>${item.relation || ''}</td>
                    </tr>
                `;
            });
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                        color: #333;
                    }
                    h1 {
                        text-align: center;
                        color: #2c3e50;
                        margin-bottom: 30px;
                        font-size: 24px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th {
                        background-color: #34495e;
                        color: white;
                        padding: 12px 8px;
                        text-align: center;
                        font-weight: bold;
                    }
                    td {
                        border: 1px solid #ddd;
                        padding: 10px 8px;
                        text-align: center;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    tr:hover {
                        background-color: #f1f1f1;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <h1>Prefix Data Report</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Prefix</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Prefix Of</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <div class="footer">
                    Generated on ${new Date().toLocaleString()}
                </div>
            </body>
            </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="prefix-report.pdf"',
            'Content-Length': pdfBuffer.length
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Puppeteer PDF server is running' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`PDF generation server running on port ${PORT}`);
});
