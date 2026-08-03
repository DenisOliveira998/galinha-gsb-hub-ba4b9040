import { Component, type ErrorInfo, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type Props = {
  children: ReactNode;
  label?: string;
};

type State = { failed: boolean };

/** Impede que uma falha de mídia/preview derrube o restante do painel. */
export class PreviewBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    reportLovableError(error, {
      boundary: "admin_preview",
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.failed) {
      return (
        <div role="status" className="flex min-h-28 items-center justify-center gap-2 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <ImageOff className="h-4 w-4" />
          {this.props.label ?? "Não foi possível exibir esta pré-visualização."}
        </div>
      );
    }
    return this.props.children;
  }
}

export function SafeImagePreview({
  src,
  alt,
  className,
  fallback = "Nenhuma imagem selecionada",
}: {
  src?: string | null;
  alt: string;
  className: string;
  fallback?: string;
}) {
  const safeSrc = typeof src === "string" ? src.trim() : "";
  if (!safeSrc) {
    return (
      <div className={`${className} grid place-items-center bg-muted p-3 text-center text-xs text-muted-foreground`}>
        {fallback}
      </div>
    );
  }
  return (
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.hidden = true;
        event.currentTarget.nextElementSibling?.removeAttribute("hidden");
      }}
    />
  );
}