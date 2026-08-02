/** Fixed site-wide atmosphere — grid, orbs, shapes, top edge (see `.app-bg` in globals.css). */
export function AppBackground() {
  return (
    <div className="app-bg" aria-hidden>
      <div className="app-bg__orb-tr" />
      <div className="app-bg__orb-bl" />
      <div className="app-bg__shapes">
        <span className="app-bg__ring app-bg__ring--1" />
        <span className="app-bg__ring app-bg__ring--2" />
        <span className="app-bg__ring app-bg__ring--3" />
        <span className="app-bg__diamond app-bg__diamond--1" />
        <span className="app-bg__diamond app-bg__diamond--2" />
        <span className="app-bg__diamond app-bg__diamond--3" />
        <span className="app-bg__dot app-bg__dot--1" />
        <span className="app-bg__dot app-bg__dot--2" />
        <span className="app-bg__dot app-bg__dot--3" />
        <span className="app-bg__dot app-bg__dot--4" />
        <span className="app-bg__dot app-bg__dot--5" />
        <span className="app-bg__dot app-bg__dot--6" />
      </div>
      <div className="app-bg__edge" />
    </div>
  );
}
