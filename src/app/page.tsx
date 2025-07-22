"use client";
import { Html5Qrcode } from "html5-qrcode";
import { Icons } from "../components/Icons";
import { useRef, useEffect, useState } from "react";
import { useModalStore } from "../store/ModalStore";
import Modal from "../components/Modal";
import { RecordList } from "../types/record";
import { MoonLoader } from "react-spinners";
import * as Sentry from "@sentry/nextjs";

export default function Home() {
  const { isVisible, showModal, userData, setUserData } = useModalStore();
  const html5QrCode = useRef<Html5Qrcode | null>(null);
  const config = { fps: 1, qrbox: { width: 250, height: 250 } };
  const [isLoading, setIsLoading] = useState(false);

  async function qrCodeSuccessCallback(decodedText: string) {
    try {
      setIsLoading(true);
      // handle the scanned code as you like, for example:
      html5QrCode.current?.stop();
      let baseUrl: string;
      if (
        process.env.NEXT_PUBLIC_API_URL &&
        process.env.NEXT_PUBLIC_API_URL.length > 0
      ) {
        baseUrl = process.env.NEXT_PUBLIC_API_URL;
      } else {
        baseUrl = "http://localhost:3000";
      }
      const req = await fetch(`${baseUrl}/scan/${decodedText}`, {
        method: "POST",
      });
      const res: RecordList = await req.json();
      setIsLoading(false);
      setUserData(res);
      showModal();
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  function onScanFailure(errorMessage: string) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${errorMessage}`);
  }

  async function startScanning() {
    if (!html5QrCode.current) {
      // to do: modal : "scan en cours d'initialisation"
      return;
    }
    // todo: check if qrscanner in instanciated
    await html5QrCode.current.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback,
      onScanFailure
    );
  }

  useEffect(() => {
    html5QrCode.current = new Html5Qrcode("reader");
  }, []);

  return (
    <main className="h-[100dvh] flex flex-col">
      <div id="reader" className="fixed top-0 w-[3O0px]"></div>
      {isVisible && <Modal userData={userData} />}
      {isLoading && (
        <div className="translate-x-1 flex size-full inset-0 justify-center items-center">
          <MoonLoader />
        </div>
      )}
      <div className="flex flex-col justify-center items-center gap-2 mx-auto mt-auto mb-5 bottom-5">
        <div
          onClick={startScanning}
          className="z-50 bg-white p-4 w-fit rounded-full"
        >
          <Icons.qr />
        </div>
        <p className="uppercase font-bold text-sm">Scanner</p>
      </div>
    </main>
  );
}
