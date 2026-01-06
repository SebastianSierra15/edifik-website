"use client";

import { useState } from "react";
import { ProjectManager } from "@/src/components/admin";

export default function PropertyPage() {
  const [projectTypeId, setProjectTypeId] = useState<number>(2);

  return (
    <ProjectManager
      isProperty={true}
      projectTypeId={projectTypeId}
      setProjectTypeId={setProjectTypeId}
    />
  );
}
