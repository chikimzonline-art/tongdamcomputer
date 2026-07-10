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

export type CourseOption = {
  code: string;
  title: string;
};

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
  course: z
    .string()
    .min(1, "Please choose a course to enroll in."),
  message: z
    .string()
    .trim()
    .max(4000, "Message is too long.")
    .optional()
    .or(z.literal("")),
});

type EnrollFormValues = z.infer<typeof formSchema>;

export function EnrollForm({ courses }: { courses: CourseOption[] }) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EnrollFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: "",
      message: "",
    },
  });

  const courseValue = watch("course");

  const onSubmit = async (values: EnrollFormValues) => {
    try {
      const subject = `Course Enrollment: ${values.course}`;
      const messageBody =
        values.message && values.message.trim().length > 0
          ? values.message
          : `I would like to enroll in the "${values.course}" course. Please share the next batch schedule, fee payment details, and documents required.`;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email || undefined,
          phone: values.phone,
          source: "computer-training",
          subject,
          message: messageBody,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Server error");
      }

      toast.success("Enrollment request sent!", {
        description: `We'll contact you about "${values.course}" shortly.`,
      });
      reset();
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error("Could not send request", {
        description:
          message + " — please try again or call us directly.",
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
            Enrollment request received!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you for your interest in the Tongdam Computer Training
            Center. Our team will reach out with batch schedule, fee
            payment, and document details.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          onClick={() => setSubmitted(false)}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Computer training course enrollment form"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="ct-name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ct-name"
            autoComplete="name"
            placeholder="e.g. Lalruatfeli Zou"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "ct-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="ct-name-error" className="text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="ct-phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ct-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. +91 98765 43210"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "ct-phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone && (
            <p id="ct-phone-error" className="text-xs text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="ct-email">
          Email{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>
        <Input
          id="ct-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "ct-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="ct-email-error" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Course select */}
      <div className="space-y-1.5">
        <Label htmlFor="ct-course">
          Course <span className="text-destructive">*</span>
        </Label>
        <Select
          value={courseValue}
          onValueChange={(val) =>
            setValue("course", val, { shouldValidate: true })
          }
        >
          <SelectTrigger
            id="ct-course"
            className="w-full"
            aria-invalid={!!errors.course}
            aria-describedby={errors.course ? "ct-course-error" : undefined}
          >
            <SelectValue placeholder="Select a course..." />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.code} value={c.title}>
                <span className="font-medium text-emerald-700">[{c.code}]</span>{" "}
                <span className="text-foreground">{c.title}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Hidden input so react-hook-form tracks the value for submit */}
        <input type="hidden" {...register("course")} />
        {errors.course && (
          <p id="ct-course-error" className="text-xs text-destructive">
            {errors.course.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="ct-message">
          Message{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>
        <Textarea
          id="ct-message"
          rows={4}
          placeholder="Preferred batch timing, prior experience, or any questions..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "ct-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="ct-message-error" className="text-xs text-destructive">
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
              Enroll Now
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
