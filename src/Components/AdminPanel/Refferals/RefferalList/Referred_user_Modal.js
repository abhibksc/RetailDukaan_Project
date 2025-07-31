;

const Referred_user_Modal = ({closeReferredUserModal , referred_user }) => {
    console.log(referred_user);
    


 



  return   <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <h2 className="text-2xl font-extrabold mb-6 text-blue-700">
              Referred user Details
            </h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-100">

                            <th className="py-2 px-4 text-start text-blue-800">
                    User Id
                  </th>
                    
                  <th className="py-2 px-4 text-start text-blue-800">
                    Name
                  </th>
                  <th className="py-2 px-4 text-start text-blue-800">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
               <tr  className="hover:bg-blue-50">
                    <td className="py-2 px-4 border-t border-gray-200">
                      {referred_user?.unique_id}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-200">
                               {referred_user?.name}
                    </td>
                    <td className="py-2 px-4 border-t border-gray-200">
                            {referred_user?.email}
                    </td>
                  </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeReferredUserModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
};

export default Referred_user_Modal;
