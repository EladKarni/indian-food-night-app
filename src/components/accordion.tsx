import { faqType } from "@/types/faqType";
import { FC } from "react";

interface AccordionProps {
  faqData: faqType;
  selectedID: string;
  setSelectedFAQID: Function;
}

const Accordion: FC<AccordionProps> = ({
  faqData: { question, id, answer },
  setSelectedFAQID,
  selectedID,
}) => {
  return (
    <div className="accordion-item flex flex-col justify-center rounded-md my-4">
      <input
        id={id}
        className="accordion-trigger-input"
        type="radio"
        onChange={(e) => setSelectedFAQID(e)}
        value={id}
        checked={selectedID === id}
      />
      <label
        className="accordion-trigger text-3xl pr-8 bg-base-300"
        htmlFor={id}
      >
        {question}
      </label>
      <article className="accordion-animation-wrapper m-0">
        <div className="accordion-animation">
          <div className="accordion-transform-wrapper">
            <div className="p-4 bg-neutral">
              <div className="[&_a]:text-primary-500 [&_a]:font-bold">
                {answer}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Accordion;
