"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

export default function CreditCardForm() {
  const { locale } = useParams();
  const [form, setForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, focus: e.target.name }));
  };

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="container py-10">
      <Cards
        number={form.number}
        name={form.name}
        expiry={form.expiry}
        cvc={form.cvc}
        focused={`${form.focus}` as "number" | "name" | "expiry" | "cvc"}
      />
      <form>
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          maxLength={16}
          autoComplete="cc-number"
          value={form.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          maxLength={30}
          autoComplete="cc-name"
          value={form.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={form.expiry}
          maxLength={5}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <input
          type="tel"
          name="cvc"
          placeholder="CVC"
          maxLength={3}
          value={form.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </form>
    </div>
  );
}
