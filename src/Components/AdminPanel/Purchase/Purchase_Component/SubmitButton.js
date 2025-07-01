const SubmitButton = ({ onSubmit }) => {
  return (
    <button
        onClick={onSubmit}
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded"
      >
        Submit Bill
      </button>
  );
};

export default SubmitButton;
