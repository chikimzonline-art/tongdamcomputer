"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICES = [
  "CSP UCO Bank Services",
  "Aadhaar & Public Identity Services",
  "DTP & Printing Works",
  "Financial & Civil Documentation",
] as const;

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters).")
    .max(120, "Name is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(30, "Phone number is too long.")
    .refine(
      (val) => /^[0-9+\-()\s]+$/.test(val),
      "Phone may only contain digits, spaces, +, -, and parentheses.",
    ),
  service: z
    .string()
    .min(1, "Please choose a service.")
    .max(200, "Service is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(4000, "Message is too long."),
});

type InquiryFormValues = z.infer<typeof formSchema>;

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const serviceValue = watch("service");

  const onSubmit = async (values: InquiryFormValues) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          source: "computer-works",
          subject: values.service,
          message: values.message,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Server error");
      }

      toast.success("Inquiry sent!", {
        description:
          "Thanks for reaching out — we'll get back to you shortly.",
      });
      reset();
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error("Could not send inquiry", {
        description:
          message + " — please try again or visit us in person.",
      });
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-4 py-10 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Thank you for your inquiry!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve received your request and will respond as soon as
            possible. For urgent matters, please visit our office or call us
            directly.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          onClick={() => setSubmitted(false)}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Computer works service inquiry form"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="cw-name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cw-name"
            autoComplete="name"
            placeholder="e.g. Lalruatfeli Zou"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cw-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="cw-name-error" className="text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="cw-phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cw-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. +91 98765 43210"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "cw-phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="cw-phone-error" className="text-xs text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Service */}
      <div className="space-y-1.5">
        <Label htmlFor="cw-service">
          Service <span className="text-destructive">*</span>
        </Label>
        <Select
          value={serviceValue}
          onValueChange={(val) =>
            setValue("service", val, { shouldValidate: true })
          }
        >
          <SelectTrigger
            id="cw-service"
            className="w-full"
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? "cw-service-error" : undefined}
          >
            <SelectValue placeholder="Choose a service..." />
          </SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register("service")} />
        {errors.service && (
          <p id="cw-service-error" className="text-xs text-destructive">
            {errors.service.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="cw-message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="cw-message"
          rows={4}
          placeholder="Tell us what you need — e.g. documents to bring, timing, etc."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cw-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="cw-message-error" className="text-xs text-destructive">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="order-2 text-xs text-muted-foreground sm:order-1">
          <span className="text-destructive">*</span> Required fields. We
          typically reply within 24 hours.
        </p>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="order-1 w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:order-2 sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              Send Inquiry
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
