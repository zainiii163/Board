"use client";

export function ShareButton() {
  function handleShare() {
    if (navigator.share) {
      navigator.share({ url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <button
      onClick={handleShare}
      className="text-sm text-accent hover:underline"
    >
      Share
    </button>
  );
}
