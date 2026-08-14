import { Heart } from "lucide-react";
import { useBlogLikeQuery, useToggleBlogLikeMutation } from "@/lib/hooks/use-blog-likes";
import { useHydrated } from "@/hooks/use-hydrated";

interface Props {
  postId: string;
  initialCount?: number;
  className?: string;
}

export function BlogLikeButton({ postId, initialCount = 0, className = "" }: Props) {
  const hydrated = useHydrated();
  const { data } = useBlogLikeQuery(postId);
  const mutation = useToggleBlogLikeMutation(postId);

  const count = data?.count ?? initialCount;
  const liked = data?.liked ?? false;

  if (!hydrated) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
        <Heart className="h-3.5 w-3.5" />
        {initialCount > 0 && <span>{initialCount}</span>}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); mutation.mutate(); }}
      disabled={mutation.isPending}
      aria-label={liked ? "Remover curtida" : "Curtir post"}
      className={`inline-flex items-center gap-1 text-xs transition ${liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-400"} ${className}`}
    >
      <Heart className={`h-3.5 w-3.5 transition-transform ${liked ? "fill-current scale-110" : ""}`} />
      {count > 0 && <span className="font-medium">{count}</span>}
    </button>
  );
}
