
const PincodeModal = ({ isOpen, onClose, warehouses }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Warehouses</h2>
        {warehouses.length === 0 ? (
          <p>No warehouses found.</p>
        ) : (
          <ul className="space-y-2">
            
            {warehouses.map((pin, idx) => (
              <li key={idx} className="p-2 border rounded overflow-y-auto">
                          <strong>Name:</strong> {pin.warehouse_name}<br />
                          <strong>Id:</strong> {pin.warehouse_unique_id}<br />

              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PincodeModal;
