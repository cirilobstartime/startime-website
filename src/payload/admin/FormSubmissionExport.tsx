import React from "react";
import Link from "next/link";

export function FormSubmissionExport() {
  return (
    <div className="startime-export-panel">
      <div>
        <strong>Export conversion data</strong>
        <p>
          Download all form answers, conversion values, first-touch and
          latest-touch attribution as a CSV file.
        </p>
      </div>
      <Link
        className="btn btn--style-primary"
        href="/api/form-submissions/export"
        prefetch={false}
      >
        Export all submissions (CSV)
      </Link>
    </div>
  );
}
