import type { NextRequest } from "next/server";
import { RecordList, visitStatus } from "../../../types/record";
import * as Sentry from "@sentry/nextjs";

export async function POST(
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
    const req = await fetch(
      `${baseUrl}?filterByFormula=numbercodebarres='${id}'`,
      {
        headers: {
          Authorization: `Bearer ${PAT}`,
          "Content-Type": "application/json",
        },
        method: "GET",
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

    console.log(res, 'res in scaned app');
    // check if the ticket exist

    if (res.records.length === 0) {
      return Response.json(res);
    }

    let newStatus: visitStatus;
    switch (res.records[0].fields.visite) {
      case visitStatus.noshow:
        newStatus = visitStatus.new;
        break;
      case visitStatus.new:
        newStatus = visitStatus.visited;
        break;
      case visitStatus.visited:
        newStatus = visitStatus.visited;
        break;
    }

    const updateBody = {
      records: [
        {
          id: res.records[0].id,
          fields: {
            visite: newStatus,
            lastVisited: new Date().toISOString(),
          },
        },
      ],
    };

    // to do: check and update "lastVisited" and "visite" status
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

    const updateResponse: RecordList = await updateReq.json();
    console.log(updateResponse.records[0].fields, "update response");

    return Response.json(updateResponse);
  } catch (error) {
    Sentry.captureException(error);
  }
}
