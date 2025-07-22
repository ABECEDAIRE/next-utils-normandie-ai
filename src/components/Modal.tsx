import React from "react";
import { useClickOutside } from "@mantine/hooks";
import { useModalStore } from "../store/ModalStore";
import { RecordList } from "../types/record";
import Tag from "./Tag";
import { visitStatus } from "../types/record";
import moment from "moment";

type ModalProps = {
  userData: RecordList | null;
};

const Modal = ({ userData }: ModalProps) => {
  const { hideModal, resetData } = useModalStore();
  const ref = useClickOutside(() => {
    hideModal();
    resetData();
  });

  if (!userData || userData.records.length === 0) {
    return (
      <section className="fixed size-full bg-[rgba(190,0,0,0.5)] flex justify-center items-center">
        <div
          ref={ref}
          className="flex flex-col py-8 px-6 items-center bg-[rgba(255,255,255,0.8)] border-4 border-solid border-white rounded-2xl max-w-[330px] w-full mx-5"
        >
          <h2>Billet inexistant</h2>
        </div>
      </section>
    );
  }

  const record = userData.records[0];
  const {
    visite,
    "Prénom du participant": firstName,
    "Nom de famille du participant": lastName,
    "Type de billet": ticketType,
    "Information Ticket": ticketInfo,
    lastVisited,
  } = record.fields;

  const getBackgroundColor = (status: string) => {
    switch (status) {
      case visitStatus.new:
        return "bg-[rgba(61,190,0,0.5)]";
      case visitStatus.visited:
        return "bg-[rgba(190,160,0,0.5)]";
      default:
        return "bg-[rgba(190,0,0,0.5)]";
    }
  };

  let lastVisitedString: string;
  if (lastVisited) {
    const lastVisitedDate = new Date(lastVisited);
    lastVisitedString = moment(lastVisitedDate).calendar();
  }

  const RenderContent = () => {
    return (
      <>
        <h2 className="mb-3 text-center">
          {firstName} {lastName}
        </h2>
        <Tag tag={ticketType} />
        {ticketInfo && (
          <p className="mt-5 text-[#474747] text-center">{ticketInfo}</p>
        )}
        {lastVisitedString && (
          <p className="mt-5 text-[#474747] text-center">
            Dernière visite : {lastVisitedString}
          </p>
        )}
      </>
    );
  };

  return (
    <section
      className={`fixed size-full ${getBackgroundColor(
        visite
      )} flex justify-center items-center`}
    >
      <div
        ref={ref}
        className="flex flex-col py-8 px-6 items-center bg-[rgba(255,255,255,0.8)] border-4 border-solid border-white rounded-2xl max-w-[330px] w-full mx-5"
      >
        <RenderContent />
      </div>
    </section>
  );
};

export default Modal;
