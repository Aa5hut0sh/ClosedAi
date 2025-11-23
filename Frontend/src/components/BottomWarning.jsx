import { Link } from "react-router-dom";

export function BottomWarning({ label, buttonText, to}) {
  return (
    <div className="py-2 text-sm flex justify-center">
      <div>{label}</div>
      <Link to ={to} className="text-blue-600 hover:text-blue-800 underline pl-2 transition-colors duration-200 ease-in-out font-medium">
        {buttonText}
      </Link>
    </div>
  );
}
