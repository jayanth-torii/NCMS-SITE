type KickerProps = {
  children: React.ReactNode;
  className?: string;
};

const Kicker = ({ children, className = "" }: KickerProps) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <span className="text-sm font-bold text-orange tracking-widest uppercase">{children}</span>
    <div className="h-px bg-orange w-12 relative">
      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange" />
    </div>
  </div>
);

export default Kicker;
