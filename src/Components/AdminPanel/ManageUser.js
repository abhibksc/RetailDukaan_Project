import React, { useState, useEffect } from 'react';
import {  GetUsersDetails } from '../CrudOperations/GetOperation';
import { deleteUser } from '../CrudOperations/DeleteOperation';
import EmptyState from '../Animation/Empty';

const ManageUsers = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);


  useEffect(()=>{
const fun = async()=>{

  const response = await GetUsersDetails();
  console.log(response);
  

  if(response){
    setUsers(response.data)
  }

  

}

fun();
  },[])



  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleDelete = async (userId) => {
    try {
      const response = await deleteUser({id:userId});

      if(response){
        setUsers(users.filter(user => user.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUser(userId, { status: newStatus });
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name &&  user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email && user.email.toLowerCase().includes(search.toLowerCase())
  );

//   if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="bg-white rounded-md shadow-lg p-4">
     <div className='flex'>

     <h1 className="text-xl font-inter font-bold mb-6 border-b-4  pb-2 text-gray-700">Manage Users</h1>

     <button>

     </button>

     </div>
      <input
        type="text"
        placeholder="Search by name or email"
        value={search}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 mb-4 w-full"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name ? user.name : null}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email ? user.email : null}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!users.length > 0 && (
        <EmptyState>
          <div className="flex flex-col gap-3 items-center">
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              No Users Found
            </h2>
            <p className="mt-2 text-gray-500">
              Looks like you don't have any Users in this section. Add some to
              get started!
            </p>
           
          </div>
        </EmptyState>
      )}
    </div>
  );
};

export default ManageUsers;
