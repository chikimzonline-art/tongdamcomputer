"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Syllabus download button — shows a sonner toast explaining that the
 * syllabus will be emailed, and offers a link to /contact with a
 * pre-filled subject. Kept simple: no real PDF generation, just a
 * CTA that routes the visitor to the contact form.
 */
export function SyllabusDownloadButton() {
  const [requested, setRequested] = useState(false);

  const handleClick = () => {
    toast.success("Syllabus request noted!", {
      description:
        "Please submit your details on the contact page — we'll email the full syllabus to you shortly.",
    });
    setRequested(true);
  };

  if (requested) {
    return (
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-700">
          <Link href="/contact?subject=Tailoring+Syllabus+Request">
            <Download className="size-4" aria-hidden="true" />
            Continue to contact form
          </Link>
        </Button>
        <span className="flex items-center gap-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          Toast sent — click above to submit your details.
        </span>
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      className="bg-amber-500 text-emerald-950 shadow-md hover:bg-amber-400"
    >
      <Download className="size-4" aria-hidden="true" />
      Download Full Syllabus
    </Button>
  );
}
