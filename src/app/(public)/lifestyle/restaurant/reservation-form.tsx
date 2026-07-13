"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, CheckCircle2, CalendarCheck } from "lucide-react";
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

const GUEST_OPTIONS = ["1-2", "3-4", "5-6", "7+"] as const;

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
  email: z
    .string()
    .trim()
    .max(160, "Email is too long.")
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Please enter a valid email address.",
    ),
  guests: z
    .string()
    .min(1, "Please choose the number of guests."),
  date: z
    .string()
    .min(1, "Please pick a preferred date."),
  time: z
    .string()
    .min(1, "Please pick a preferred time."),
  specialRequest: z
    .string()
    .trim()
    .max(1000, "Special request is too long.")
    .optional()
    .or(z.literal("")),
});

type ReservationFormValues = z.infer<typeof formSchema>;

type ReservationConfirmation = {
  guests: string;
  date: string;
  time: string;
};

export function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] =
    useState<ReservationConfirmation | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      guests: "",
      date: "",
      time: "",
      specialRequest: "",
    },
  });

  const guestsValue = watch("guests");

  const formatDate = (iso: string): string => {
    if (!iso) return "";
    try {
      const d = new Date(`${iso}T00:00:00`);
      return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const formatTime = (hhmm: string): string => {
    if (!hhmm) return "";
    try {
      const [hStr, mStr] = hhmm.split(":");
      const h = Number(hStr);
      const m = Number(mStr);
      if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
      const period = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${String(m).padStart(2, "0")} ${period}`;
    } catch {
      return hhmm;
    }
  };

  const onSubmit = async (values: ReservationFormValues) => {
    try {
      const special = values.specialRequest?.trim() || "";
      const message =
        `Reservation for ${values.guests} on ${values.date} at ${values.time}.` +
        (special ? ` ${special}` : "");

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email || undefined,
          source: "restaurant",
          subject: "Table Reservation",
          message,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Server error");
      }

      toast.success("Reservation request sent!", {
        description:
          "We'll confirm your table by phone shortly. See you soon!",
      });

      setConfirmation({
        guests: values.guests,
        date: values.date,
        time: values.time,
      });
      reset();
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error("Could not send reservation", {
        description:
          message + " — please try again or call us directly.",
      });
    }
  };

  if (submitted && confirmation) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-4 py-8 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-8" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            Table reservation requested!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Thanks — we&apos;ve received your request and our team will
            confirm availability by phone shortly.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <CalendarCheck className="size-4 text-emerald-600" aria-hidden="true" />
            <span className="font-medium">Summary:</span>
            <span>
              {confirmation.guests} guests · {formatDate(confirmation.date)} ·{" "}
              {formatTime(confirmation.time)}
            </span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          onClick={() => {
            setSubmitted(false);
            setConfirmation(null);
          }}
        >
          Make another reservation
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Restaurant table reservation form"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="rs-name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="rs-name"
            autoComplete="name"
            placeholder="e.g. Lalruatfeli Zou"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "rs-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="rs-name-error" className="text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="rs-phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="rs-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. +91 98765 43210"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "rs-phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="rs-phone-error" className="text-xs text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="rs-email">Email (optional)</Label>
        <Input
          id="rs-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "rs-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="rs-email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Number of Guests */}
        <div className="space-y-1.5">
          <Label htmlFor="rs-guests">
            Guests <span className="text-destructive">*</span>
          </Label>
          <Select
            value={guestsValue}
            onValueChange={(val) =>
              setValue("guests", val, { shouldValidate: true })
            }
          >
            <SelectTrigger
              id="rs-guests"
              className="w-full"
              aria-invalid={!!errors.guests}
              aria-describedby={errors.guests ? "rs-guests-error" : undefined}
            >
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {GUEST_OPTIONS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g} guests
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("guests")} />
          {errors.guests && (
            <p id="rs-guests-error" className="text-xs text-destructive">
              {errors.guests.message}
            </p>
          )}
        </div>

        {/* Preferred Date */}
        <div className="space-y-1.5">
          <Label htmlFor="rs-date">
            Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="rs-date"
            type="date"
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "rs-date-error" : undefined}
            {...register("date")}
          />
          {errors.date && (
            <p id="rs-date-error" className="text-xs text-destructive">
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Preferred Time */}
        <div className="space-y-1.5">
          <Label htmlFor="rs-time">
            Time <span className="text-destructive">*</span>
          </Label>
          <Input
            id="rs-time"
            type="time"
            aria-invalid={!!errors.time}
            aria-describedby={errors.time ? "rs-time-error" : undefined}
            {...register("time")}
          />
          {errors.time && (
            <p id="rs-time-error" className="text-xs text-destructive">
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      {/* Special Request */}
      <div className="space-y-1.5">
        <Label htmlFor="rs-special">Special Request (optional)</Label>
        <Textarea
          id="rs-special"
          rows={3}
          placeholder="e.g. window seat, birthday cake, high chair for a child..."
          aria-invalid={!!errors.specialRequest}
          aria-describedby={
            errors.specialRequest ? "rs-special-error" : undefined
          }
          {...register("specialRequest")}
        />
        {errors.specialRequest && (
          <p id="rs-special-error" className="text-xs text-destructive">
            {errors.specialRequest.message}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="order-2 text-xs text-muted-foreground sm:order-1">
          <span className="text-destructive">*</span> Required fields. We
          typically confirm within an hour during open hours.
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
              Request Reservation
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
