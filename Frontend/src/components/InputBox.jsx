


 export const InputBox = ({ label, placeholder, type = "text", value, onChange }) => {
  return (
    <div className="flex flex-col text-left w-full mb-4">
      {label && (
        <label className="text-sm font-semibold text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </div>
  );
};

