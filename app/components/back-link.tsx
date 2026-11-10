"use client";
import { Arrow } from "./icons";
export default function BackLink({ slug }: { slug: string }) {
  return (
    <a
      className="text-link"
      href={`/projects?project=${slug}`}
      onClick={(e) => {
        if (sessionStorage.getItem("portfolio-return") && history.length > 1) {
          e.preventDefault();
          history.back();
        }
      }}
    >
      <Arrow back /> All projects
    </a>
  );
}
