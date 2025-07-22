import type { NextRequest } from "next/server";
import { Record, RelanceStatus } from "../../../types/record";
import { generateTicketPDF } from "../../../utils/pdf";
import sendMail from "../../../utils/email";
import RelanceTemplate from "../../../emails/RelanceTemplate";
import ticketDataSchema from "../../../schema/ticketData.schema";
import * as Sentry from "@sentry/nextjs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const baseUrl = process.env.BASE_URL;
    const PAT = process.env.PAT;
    if (baseUrl === undefined || PAT === undefined) {
      throw new Error("Failed to load env variables");
    }

    // validate id

    // get record
    const req = await fetch(`${baseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${PAT}`,
        "Content-Type": "application/json",
      },
    });
    if (req.status === 401) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    const res: Record = await req.json();

    // recCdYMWRYF4bMwCU -> id de test de la raw "Alexandre KAKAL" sur Airtable
    if (
      res.fields["relanceStatus"] === RelanceStatus.relanced &&
      id != "recCdYMWRYF4bMwCU"
    ) {
      return Response.json({
        message: "Déjà relancé",
      });
    }

    // const ticketData = {
    //   id: res.fields.numbercodebarres.text,
    //   lastname: res.fields["Nom de famille du participant"],
    //   firstname: res.fields["Prénom du participant"],
    //   email: res.fields["Courriel du participant"],
    //   ticketType: res.fields["Type de billet"],
    // };

    // const validatedData = ticketDataSchema.safeParse(ticketData);

    // let sentMessageInfo;
    // if (validatedData.success) {
    // const pdfFile = await generateTicketPDF(ticketData);

    const sentMessageInfo = await sendMail({
      from: process.env.MAILER_SENDER as string,
      to: res.fields["Courriel du participant"],
      subject: `Normandie.ai // Merci ${res.fields["Prénom du participant"]} !`,
      // pdfFile,
      template: RelanceTemplate(),
      ticketTypeName: res.fields["Type de billet"],
      ticketId: res.fields.numbercodebarres.text,
    });
    // }

    // if (sentMessageInfo) {
    //   Sentry.captureMessage(JSON.stringify(sentMessageInfo));
    // }

    let newStatus;
    if (sentMessageInfo?.accepted) {
      newStatus = RelanceStatus.relanced;
    } else if (
      sentMessageInfo?.rejected ||
      sentMessageInfo === undefined
      // || !validatedData.success
    ) {
      newStatus = RelanceStatus.error;
    }

    // changer le statut de suivi email airtable
    const updateBody = {
      records: [
        {
          id: res.id,
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
      const error = await updateReq.json();
      console.error("Failed to update record:", error);
      throw new Error("Failed to update record");
    }

    return Response.json({
      message: "mail send successfully !",
    });
  } catch (error) {
    Sentry.captureException(error);
    return Response.json(error);
  }
}
