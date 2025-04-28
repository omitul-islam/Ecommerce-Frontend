import React, { useEffect, useState } from "react";
import { deleteUser, getUsersByAdmin, updateUser } from "../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await getUsersByAdmin();
        console.log(usersData.Users);
        setUsers(usersData.Users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    };

    loadUsers();
  }, []);

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const updatedUser = await updateUser(userId, updatedData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...updatedUser } : user
        )
      );
      window.location.reload();
      alert("This user is now Admin!");
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error.message);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">All Users</h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="p-4 border rounded-lg shadow-md hover:shadow-xl transition duration-300 bg-white"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{user.username}</h3>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Role: {user.role}</p>

              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleUpdateUser(user._id, { role: 'admin' })}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Make Admin
                </button>

                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
