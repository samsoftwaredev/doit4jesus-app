import type { ReactNode } from "react";

import { PageHeader } from "@/components";

type BackHeaderProps = {
  description: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  title: string;
};

/** Adapts feature-route navigation to the shared compact page-header presentation. */
export function BackHeader({ description, onBack, rightAction, title }: BackHeaderProps) {
  return <PageHeader actions={rightAction} description={description} onBack={onBack} title={title} variant="compact" />;
}
