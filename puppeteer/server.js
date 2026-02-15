const express = require('express')
const puppeteer = require('puppeteer')

const app = express()

app.get('/pdf', async(req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()

    const htmlContent = `
        <html>
            <body>
                <h1>Hello world</h1>
            </body>
        </html>
    `;

    await page.setContent(htmlContent)
    const pdfBuffer = await page.pdf({ format: 'A4'})

    await browser.close();

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="generate-pdf.pdf"',
        'Content-Length': pdfBuffer.length
    })

    res.send(pdfBuffer)
})

app.listen(3000, ()=>{
    console.log('PDF generation server running on port 3000')
})