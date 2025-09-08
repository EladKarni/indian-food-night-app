"use client";
import { faqType } from "@/types/faqType";
import Accordion from "@/components/accordion";
import { SetStateAction, useState } from "react";
import SectionContainer from "@/ui/SectionContainer";
import SubtitleText from "@/ui/SubtitleText";

interface FAQPropTypes {
  faqItems: faqType[];
}

const FAQSection = ({ faqItems }: FAQPropTypes) => {
  const [selectedFAQ, setSelectedFAQ] = useState(faqItems[0].id);
  const onOptionChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSelectedFAQ(e.target.value);
  };
  console.log(faqItems);
  return (
    <SectionContainer
      sectionName="faq"
      sectionClasses="flex flex-col align-middle "
    >
      <SubtitleText>FAQ Example</SubtitleText>
      <fieldset className="accordion">
        {faqItems.map((faq) => (
          <Accordion
            faqData={faq}
            key={faq.id}
            selectedID={selectedFAQ}
            setSelectedFAQID={onOptionChange}
          />
        ))}
      </fieldset>
    </SectionContainer>
  );
};

export default FAQSection;
