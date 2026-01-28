import React, { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import { FaTrash, FaLock, FaLockOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (_id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/api/admin/users/${_id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };


  const toggleBlockUser = async (_id) => {
    try {
      await api.patch(`/api/admin/users/${_id}/block`);
      toast.success("Status updated");
      fetchUsers();
    } catch {
      toast.error("Update failed");
    }
  };


  const applyFilters = () => {
    let filtered = [...users];

    if (roleFilter !== "All") {
      filtered = filtered.filter((user) => user.role === roleFilter.toLowerCase());
    }

    if (statusFilter === "Blocked") {
      filtered = filtered.filter((user) => user.isBlocked === true);
    } else if (statusFilter === "Unblocked") {
      filtered = filtered.filter((user) => user.isBlocked === false);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredUsers.length / usersPerPage)));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-blue-800 flex items-center gap-3">
            Manage Users
          </h1>
        </div>

        {/* Filters */}
        <div className="mb-6 p-5 bg-white rounded-xl shadow-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-lg font-medium text-gray-700 mb-2">Filter by Role:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
            <div className="flex-1 min-w-[250px]">
              <label className="block text-lg font-medium text-gray-700 mb-2">Filter by Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-2 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Blocked">Blocked</option>
                <option value="Unblocked">Unblocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-xl text-gray-500">No users found with current filters.</p>
            </div>
          ) : (
            <>
              <table className="min-w-full text-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-8 py-5 text-left">_id</th>
                    <th className="px-8 py-5 text-left">Name</th>
                    <th className="px-8 py-5 text-left">Email</th>
                    <th className="px-8 py-5 text-left">Role</th>
                    <th className="px-8 py-5 text-left">Status</th>
                    <th className="px-8 py-5 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="div_ide-y div_ide-gray-200">
                  {currentUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-6 font-medium text-gray-800">{user._id}</td>
                      <td className="px-8 py-6 capitalize">{user.name || "—"}</td>
                      <td className="px-8 py-6 text-gray-600">{user.email}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => toggleBlockUser(user._id, user.isBlocked)}
                            className={`p-3 rounded-lg shadow hover:shadow-md transition-all ${user.isBlocked
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                            title={user.isBlocked ? "Unblock User" : "Block User"}
                          >
                            {user.isBlocked ? <FaLockOpen size={16} /> : <FaLock size={16} />}
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow hover:shadow-md transition-all"
                            title="Delete User"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredUsers.length > usersPerPage && (
                <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-gray-600">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`p-3 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <FaChevronLeft size={16} />
                    </button>

                    {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`w-12 h-12 rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} border border-gray-200`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                      className={`p-3 rounded-lg ${currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}