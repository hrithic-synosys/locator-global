import type { ContentCard } from "@/content/page-schema";
export default function ContentIcon({
  name = "camera",
}: {
  name?: ContentCard["icon"];
}) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#374151"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {name === "camera" && (
        <>
          <rect x="2" y="5" width="15" height="14" rx="2" />
          <path d="M17 9l5-3v12l-5-3V9z" strokeLinejoin="round" />
        </>
      )}
      {name === "shield" && (
        <>
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {name === "monitor" && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path
            d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
            strokeLinecap="round"
          />
        </>
      )}
      {name === "cost" && (
        <>
          <path
            d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
            strokeLinecap="round"
          />
        </>
      )}
      {name === "cargo" && (
        <>
          <path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" strokeLinejoin="round" />
          <path d="m3 7 9 4 9-4M12 11v10M8 5l9 4" />
        </>
      )}
    </svg>
  );
}
