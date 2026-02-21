import type { ProjectStatus } from "@/types/project";
import { CheckCircle2, Lock } from "lucide-react";

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  if (status === "Taken") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold status-taken">
        <Lock className="w-3 h-3" />
        Taken
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold status-idea">
      <CheckCircle2 className="w-3 h-3" />
      Idea Submitted
    </span>
  );
};

export default StatusBadge;
