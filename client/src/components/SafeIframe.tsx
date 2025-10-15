interface SafeIframeProps {
  src: string;
  title: string;
  className?: string;
}

const ALLOWED_HOSTS = [
  'https://www.youtube-nocookie.com',
  'https://player.vimeo.com',
  'https://checkout.stripe.com',
];

export function SafeIframe({ src, title, className }: SafeIframeProps) {
  const isAllowed = ALLOWED_HOSTS.some(host => src.startsWith(host));

  if (!isAllowed) {
    return (
      <div className={className}>
        <p className="text-sm text-muted-foreground">
          This content cannot be displayed for security reasons.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      className={className}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      loading="lazy"
    />
  );
}
