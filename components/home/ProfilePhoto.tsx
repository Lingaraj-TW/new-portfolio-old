interface ProfilePhotoProps {
  /** Tailwind classes applied to the outer wrapper — controls size and visibility */
  className?: string;
}

export function ProfilePhoto({ className = "" }: ProfilePhotoProps) {
  return (
    <div
      className={`profile-photo-shell relative transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ flexShrink: 0 }}
    >
      {/* Gradient ring */}
      <div className="profile-ring" aria-hidden />
      {/* Inner gap ring */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "var(--bg-primary, var(--background))",
          zIndex: 1,
          margin: "2px",
        }}
      />
      {/* Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/profile-photo.jpg"
        alt="Linga Raj M — Senior Technical Writer"
        className="profile-photo-img"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "center top",
          position: "relative",
          zIndex: 2,
          display: "block",
          animation: "fadeInPhoto 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both",
        }}
      />
    </div>
  );
}
