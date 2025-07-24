import { RecordList, RelanceStatus } from "../../types/record";
import { generateTicketPDF } from "../../utils/pdf";
import sendMail from "../../utils/email";
import RelanceTemplate from "../../emails/RelanceTemplate";
import ticketDataSchema from "../../schema/ticketData.schema";
import * as Sentry from "@sentry/nextjs";

export async function POST() {
  try {
    const baseUrl = process.env.BASE_URL;
    const PAT = process.env.PAT;
    if (!baseUrl || !PAT) {
      throw new Error("Failed to load env variables");
    }

    // get all records
    const req = await fetch(
      `${baseUrl}?filterByFormula=AND(OR(relanceStatus='toRelance',relanceStatus='error'),OR(visite='new',visite='visited'),OR({Type de billet}='Normandie.ai // Ticket d\'accès VIP',{Type de billet}='Normandie.ai // Ticket d\'accès professionnel'))`,
      {
        headers: {
          Authorization: `Bearer ${PAT}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (req.status === 401) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const res: RecordList = await req.json();
    console.log(res);
    const records = res.records.slice(0, 100); // Prendre uniquement les 100 premiers enregistrements

    // Traiter chaque enregistrement individuellement
    for (const record of records) {
      // const ticketData = {
      //   id: record.fields.numbercodebarres.text,
      //   lastname: record.fields["Nom de famille du participant"],
      //   firstname: record.fields["Prénom du participant"],
      //   email: record.fields["Courriel du participant"],
      //   ticketType: record.fields["Type de billet"],
      // };

      // const validatedData = ticketDataSchema.safeParse(ticketData);

      // let sentMessageInfo;
      // if (validatedData.success) {
      // const pdfFile = await generateTicketPDF(ticketData);

      const sentMessageInfo = await sendMail({
        from: process.env.MAILER_SENDER as string,
        to: record.fields["Courriel du participant"],
        subject: `Pssst ${record.fields["Prénom du participant"]}, on a une annonce pour vous 🤫`,
        // pdfFile,
        template: RelanceTemplate(),
        ticketId: record.fields.numbercodebarres.text,
        ticketTypeName: record.fields["Type de billet"],
      });
      // }

      // if (sentMessageInfo) {
      //   Sentry.captureMessage(JSON.stringify(sentMessageInfo));
      // }

      let newStatus;
      if (sentMessageInfo?.accepted) {
        newStatus = RelanceStatus.relanced;
      } else {
        newStatus = RelanceStatus.error;
      }

      // Mettre à jour le statut de suivi email dans Airtable
      const updateBody = {
        records: [
          {
            id: record.id,
            fields: {
              relanceStatus: newStatus,
            },
          },
        ],
      };

      const updateReq = await fetch(`${baseUrl}`, {
        headers: {
          Authorization: `Bearer ${PAT}`,
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(updateBody),
      });

      if (!updateReq.ok) {
        const error = await updateReq.text();
        console.error(`Failed to update record ${record.id}:`, error);
        throw new Error(`Failed to update record ${record.id}`);
      }
    }

    // Renvoyer la réponse immédiatement
    return Response.json({
      message:
        "Processing completed. Emails have been sent for the 100 records.",
    });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    Sentry.captureException(error);
    return Response.json(
      {
        message: "An error occurred",
      },
      { status: 500 }
    );
  }
}
