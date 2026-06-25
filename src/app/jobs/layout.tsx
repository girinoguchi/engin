import { JobsAutoRefresh } from "@/components/JobsAutoRefresh";

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JobsAutoRefresh />
      {children}
    </>
  );
}
