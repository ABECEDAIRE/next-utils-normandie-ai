import { PDFDocument, rgb } from "pdf-lib";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { ticketType } from "../types/record";
import * as Sentry from "@sentry/nextjs";

export async function generateTicketPDF(userData: {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  ticketType: ticketType;
}) {
  try {
    // Charger le modèle PDF existant depuis un fichier
    let templatePath;
    switch (userData.ticketType) {
      case ticketType.vip:
        templatePath = path.resolve("public", "ticket-vip.pdf");
        break;
      case ticketType.student:
        templatePath = path.resolve("public", "ticket-student.pdf");
        break;
      default:
        templatePath = path.resolve("public", "ticket-pro.pdf");
        break;
    }
    const templateBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    pdfDoc.registerFontkit(fontkit);
    const avegaFontPath = path.resolve("public", "fonts", "avega-italic.ttf");
    const avegaFontBytes = fs.readFileSync(avegaFontPath);
    const avegaItalic = await pdfDoc.embedFont(avegaFontBytes);

    const maaxItalicFontPath = path.resolve(
      "public",
      "fonts",
      "maax-italic.otf"
    );
    const maaxItalicFontBytes = fs.readFileSync(maaxItalicFontPath);
    const maaxItalic = await pdfDoc.embedFont(maaxItalicFontBytes);

    const maaxRegularFontPath = path.resolve(
      "public",
      "fonts",
      "maax-regular.otf"
    );
    const maaxRegularFontBytes = fs.readFileSync(maaxRegularFontPath);
    const maaxRegular = await pdfDoc.embedFont(maaxRegularFontBytes);

    // Générer le QR Code avec l'identifiant et les informations utilisateur
    const qrData = `${userData.id}`;

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      scale: 10,
      margin: 1,
    });

    // Extraire l'image du QR Code pour l'intégrer au PDF
    const qrImageBytes = qrCodeDataURL.split(",")[1];
    const qrImage = await pdfDoc.embedPng(Buffer.from(qrImageBytes, "base64"));

    // Dimensions et position du QR Code sur le PDF
    const qrDims = { width: 130, height: 130 };

    page.drawImage(qrImage, {
      x: 580,
      y: 90,
      width: qrDims.width,
      height: qrDims.height,
    });

    page.drawText(userData.id, {
      x: 573,
      y: 75,
      size: 10,
      font: maaxRegular,
      color: rgb(0, 0, 0),
    });

    const fullName = `${userData.firstname} ${userData.lastname}`.toUpperCase();

    page.drawText(fullName, {
      x: 45,
      y: 140,
      size: 20,
      font: avegaItalic,
      color: rgb(1, 1, 1),
    });

    page.drawText(userData.email, {
      x: 44,
      y: 120,
      size: 12,
      font: maaxItalic,
      color: rgb(1, 1, 1),
    });

    const pdfBytes = await pdfDoc.save();

    // Retourner le PDF en tant que Buffer ou le sauvegarder dans un fichier
    return pdfBytes;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export const savePDFToPublic = async (
  pdfData: Uint8Array,
  filename: string
) => {
  try {
    // Chemin complet vers le fichier dans le dossier public
    const filePath = path.join(process.cwd(), "public", filename);

    // Écrire le Uint8Array dans le fichier
    fs.writeFileSync(filePath, Buffer.from(pdfData));

    console.log(`Fichier PDF sauvegardé avec succès à : ${filePath}`);
  } catch (error) {
    Sentry.captureException(error);
  }
};
