"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";

interface FormData {
  price: string;
  deposit: string;
}

interface FormErrors {
  price?: string;
  deposit?: string;
}

type ValidationStatus = boolean | "untouched";

function isValidPositiveNumber(value: string): boolean {
  if (!value) return false;
  const num = Number(value);
  if (isNaN(num)) return false;
  return num > 0;
}

export default function WizardPage() {
  const [data, setData] = useState<FormData>({ price: "", deposit: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, ValidationStatus>>({
    price: "untouched",
    deposit: "untouched",
  });

  const priceValid = isValidPositiveNumber(data.price);
  const depositValid = isValidPositiveNumber(data.deposit);
  const isNextEnabled = priceValid && depositValid;

  const getErrors = (): FormErrors => {
    const errs: FormErrors = {};

    if (touched.price === "untouched" && touched.deposit === "untouched") {
      return {};
    }

    if (data.price && !priceValid) {
      errs.price = "Please enter a valid positive number";
    }
    if (touched.price === true && !data.price) {
      errs.price = "Property price is required";
    }

    if (data.deposit && !depositValid) {
      errs.deposit = "Please enter a valid positive number";
    }
    if (touched.deposit === true && !data.deposit) {
      errs.deposit = "Deposit amount is required";
    }

    if (!data.price && touched.deposit === true) {
      errs.price = "Property price is required";
    }
    if (!data.deposit && touched.price === true) {
      errs.deposit = "Deposit amount is required";
    }

    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ price: true, deposit: true });
    setErrors(getErrors());
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...data, [field]: e.target.value };
    setData(newData);
    const prevTouched = touched[field];
    if (prevTouched === "untouched") {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
    setErrors(getErrors());
  };

  const handleBlur = (field: keyof FormData) => () => {
    const prevTouched = touched[field];
    if (prevTouched !== "untouched") return;
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(getErrors());
  };

  const showError = (field: keyof FormData): string | undefined => {
    if (touched[field] === "untouched") return undefined;
    return errors[field];
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Property Details</CardTitle>
          <CardDescription>
            Enter the property price and your deposit to calculate your mortgage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <Input
                label="Property Price (EUR)"
                type="text"
                inputMode="numeric"
                placeholder="250000"
                iconLeft={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                value={data.price}
                onChange={handleChange("price")}
                onBlur={handleBlur("price")}
                error={showError("price")}
              />
              <Input
                label="Deposit Amount (EUR)"
                type="text"
                inputMode="numeric"
                placeholder="50000"
                iconLeft={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                value={data.deposit}
                onChange={handleChange("deposit")}
                onBlur={handleBlur("deposit")}
                error={showError("deposit")}
              />
            </div>
            <div className="mt-8">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!isNextEnabled}
                iconRight={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
              >
                Next
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
