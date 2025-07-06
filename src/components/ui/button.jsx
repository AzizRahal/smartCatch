export function Button({ children, variant, ...props }) {
  const base = "px-3 py-1.5 rounded text-white bg-blue-600 hover:bg-blue-700";
  const outline = "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50";
  return <button className={variant === "outline" ? outline : base} {...props}>{children}</button>;
}
