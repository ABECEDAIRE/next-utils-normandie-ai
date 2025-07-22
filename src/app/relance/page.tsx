"use client";
import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { MoonLoader } from "react-spinners";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";

const SendMail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);

  let baseUrl: string;
  if (
    process.env.NEXT_PUBLIC_API_URL &&
    process.env.NEXT_PUBLIC_API_URL.length > 0
  ) {
    baseUrl = process.env.NEXT_PUBLIC_API_URL;
  } else {
    baseUrl = "http://localhost:3000";
  }

  async function relance() {
    try {
      setIsLoading(true);
      const res = await fetch(`${baseUrl}/send-email`, {
        method: "POST",
      });
      const json = await res.json();
      setIsLoading(false);
      toast.success("Relance en cours, suivez la progression sur Airtable.");
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  const displayLoader = isTestLoading || isLoading;

  async function test() {
    try {
      setIsTestLoading(true);
      const res = await fetch(`${baseUrl}/send-email/recCdYMWRYF4bMwCU`, {
        method: "GET",
      });
      const json = await res.json();
      setIsTestLoading(false);
      toast.success("Relance en cours, suivez la progression sur Airtable.");
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  return (
    <main className="h-[100dvh] flex flex-col items-center justify-center gap-5">
      {displayLoader && (
        <div className="translate-x-1 flex justify-center items-center">
          <MoonLoader />
        </div>
      )}
      <h1 className="text-2xl font-bold">Lancer le processus de relance</h1>
      <p className="text-center leading-6 max-w-[650px]">
        100 relances vont être effectuées aux personnes ayant le statut
        "toRelance" et "error".
      </p>
      <p className="text-center leading-6 max-w-[650px]">
        Suivez la progression sur Airtable une fois le processus lancé. <br />{" "}
        <span className="underline">
          (Attention limite d'envoie : 100 relances/h)
        </span>
      </p>
      <Button onClick={relance} disabled={isLoading}>
        Relancer
      </Button>

      <Button variant="secondary" onClick={test} disabled={isTestLoading}>
        Tester
      </Button>
    </main>
  );
};

export default SendMail;
