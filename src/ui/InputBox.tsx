import React from "react";

type InputBoxProps = {
  children: React.ReactNode;
  id: string;
  field: string;
  placeholder: string;
  inputType: "text" | "email" | "tel";
};

const InputBox = ({ children, id, field, placeholder }: InputBoxProps) => {
  return (
    <label
      className="input input-bordered flex items-center gap-2 focus-within:border-primary"
      htmlFor={id}
    >
      {children}
      <input
        required
        type="text"
        className="grow border-none outline-none"
        placeholder={placeholder}
        name={field}
        id={id}
      />
    </label>
  );
};

export default InputBox;
