interface HilalCrestProps {
  className?: string;
}

export function HilalCrest({ className = 'w-8 h-9' }: HilalCrestProps) {
  return (
    <img
      src="/assets/hilal/crest.png"
      alt="شعار نادي الهلال السعودي"
      referrerPolicy="no-referrer"
      className={`${className} object-contain brightness-0 invert select-none`}
    />
  );
}
