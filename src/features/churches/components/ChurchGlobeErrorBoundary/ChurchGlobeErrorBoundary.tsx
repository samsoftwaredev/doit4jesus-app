import { Component, type ErrorInfo, type ReactNode } from "react";

export type ChurchGlobeErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type ChurchGlobeErrorBoundaryState = {
  failed: boolean;
};

/** Replaces the optional 3D preview with its configured fallback when the render tree fails. */
export class ChurchGlobeErrorBoundary extends Component<ChurchGlobeErrorBoundaryProps, ChurchGlobeErrorBoundaryState> {
  state: ChurchGlobeErrorBoundaryState = { failed: false };

  /** Converts any descendant rendering failure into the boundary's fallback state. */
  static getDerivedStateFromError(_error: Error): ChurchGlobeErrorBoundaryState {
    return { failed: true };
  }

  /** Reports the captured error without preventing the configured fallback from rendering. */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  /** Renders either the healthy 3D tree or the configured fallback. */
  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
