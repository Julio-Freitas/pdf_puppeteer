const express = require("express");
const passagers = require("./db/passengers");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.static(__dirname + "/pdf-template"));

app.get("/", (req, res) => {
  const pathFile = path.join(__dirname, "pdf-template", "index.ejs");

  ejs.renderFile(pathFile, {}, (err, html) => {
    if (err) return res.send("Error na leitura do file");

    return res.send(html);
  });
});

app.get("/pdf", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:8080/", {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    printBackground: true,
    format: "letter",
  });

  await browser.close();
  res.contentType("application/pdf");
  return res.send(pdf);
});

app.listen(8080, () => console.log("app running in port 8080"));
