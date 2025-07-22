import React from "react";
import { ticketType } from "../types/record";

type TagProps = {
  tag: ticketType | string;
};

const Tag = ({ tag }: TagProps) => {
  if (tag === ticketType.pro) {
    return (
      <div className="bg-[#0085FF] px-[14px] py-[9px] rounded-[65px] text-[30px] leading-none text-white font-bold">
        Visiteur
      </div>
    );
  } else if (tag === ticketType.student) {
    return (
      <div className="bg-[#00B61D] px-[14px] py-[9px] rounded-[65px] text-[30px] leading-none text-white font-bold">
        Étudiant
      </div>
    );
  } else if (tag === ticketType.vip) {
    return (
      <div className="bg-[#FFB800] px-[14px] py-[9px] rounded-[65px] text-[30px] leading-none text-white font-bold">
        VIP
      </div>
    );
  } else {
    return (
      <div className="bg-[#E543FF] px-[14px] py-[9px] rounded-[65px] text-[30px] leading-none text-white font-bold">
        Autre
      </div>
    );
  }
};

export default Tag;
