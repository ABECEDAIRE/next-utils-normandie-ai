// import { render } from "@react-email/render";
import nodemailer, { SendMailOptions } from "nodemailer";
import { ReactElement } from "react";
import fs from "fs";
import path from "path";
import * as Sentry from "@sentry/nextjs";

type EmailProps = {
  from: string;
  to: string;
  subject: string;
  template: ReactElement;
  pdfFile?: Uint8Array;
  ticketTypeName: string;
  ticketId: string;
};

const textVersion = `
NORMANDIE.AI - SAVE THE DATE

Après avoir partagé cette belle aventure avec nous en décembre dernier, vous méritez bien d'être les premiers dans la confidence...

SAVE THE DATE : 11 décembre 2025

La 2ème édition de Normandie.ai // Les journées normandes des intelligences artificielles responsables arrive !

Après le succès de décembre 2024, une seule question : comment faire encore mieux ? On a trouvé.

Et cette fois, nous vous accueillons dans un lieu pensé pour votre confort : le Pathé Docks 76 🍿

Demain sur LinkedIn. Aujourd'hui, c'est notre petit secret 🤫

En attendant, si vous suivez déjà notre page LinkedIn (https://www.linkedin.com/company/normandie-ai/?viewAsMember=true), vous pourrez être parmi les premiers à réagir à l'annonce officielle. Et si ce n'est pas encore fait... vous savez ce qu'il vous reste à faire 😉

Plus d'infos sur notre site 👉 normandie.ai (https://normandie.ai/)

À très vite,
L'équipe Normandie.ai

LinkedIn : https://www.linkedin.com/company/normandie-ai/?viewAsMember=true
Se désabonner de l'aventure
`;

const sendMail = async ({
  from,
  to,
  subject,
}: // template,
// pdfFile,
// ticketTypeName,
// ticketId,
EmailProps) => {
  try {
    // const emailHtml = await render(template);
    const emailTemplatePath = path.resolve("./public/email/save-the-date.html");
    const emailHtml = fs.readFileSync(emailTemplatePath, "utf-8");

    const transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    // let fileTicketName: string;
    // switch (ticketTypeName) {
    //   case ticketType.pro:
    //     fileTicketName = "Normandie.ai // Ticket professionnel";
    //     break;
    //   case ticketType.student:
    //     fileTicketName = "Normandie.ai // Ticket etudiant";
    //     break;
    //   case ticketType.vip:
    //     fileTicketName = "Normandie.ai // Ticket VIP";
    //     break;
    //   default:
    //     fileTicketName = "Normandie.ai // Ticket professionnel";
    //     break;
    // }

    const options: SendMailOptions = {
      from,
      to,
      subject,
      html: emailHtml,
      text: textVersion,
      headers: {
        "List-Unsubscribe": "<mailto:alex@utils.normandie.ai>",
        "List-Unsubscribe-Post": "<mailto:alex@utils.normandie.ai>",
      },
      // attachments: [
      //   {
      //     filename: `${fileTicketName} - ${ticketId}.pdf`, // eg. "Normandie.ai // Ticket professionnel - 123456.pdf"
      //     content: Buffer.from(pdfFile),
      //     contentType: "application/pdf",
      //   },
      // ],
      envelope: {
        from: "alex@utils.normandie.ai",
        to,
      },
    };

    const sentMessageInfo = await transporter.sendMail(options);
    return sentMessageInfo;
  } catch (error) {
    Sentry.captureException(error);
  }
};

export default sendMail;
