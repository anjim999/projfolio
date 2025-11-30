import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosClient";
import Navbar from "../components/Navbar";
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // Assuming the backend returns all users, including admins
      const res = await api.get("/api/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Admin users error:", err?.response?.data || err);
      // IMPORTANT: Using console.error instead of alert()
      console.error("Failed to load users: Please check network and API endpoint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter out any users with the 'admin' role, as requested.
  // This ensures admins do not appear in the 'Admin Students List'.
  const studentUsers = users.filter(u => u.role !== 'admin');

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <>
    <Navbar />
    
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Students List
          </h1>
          {/* Restored the "View All Submissions" link */}
          {/* <Link
            to="/admin/submissions"
            className="cursor-pointer text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
          >
            View All Submissions
          </Link> */}
        </div>

        {studentUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No student users found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                    Email
                  </th>
                  {/* <th className="px-4 py-2 text-left text-gray-600 font-semibold">
                    Role
                  </th> */}
                  <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                    Suggestions
                  </th>
                  <th className="px-4 py-2 text-center text-gray-600 font-semibold">
                    Submissions
                  </th>
                  <th className="px-4 py-2 text-right text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Mapping over the FILTERED array (studentUsers) */}
                {studentUsers.map((u) => {
                    const userKey=u.id||u._id

                  return(<tr
                    key={userKey}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    {/* <td className="px-4 py-2 capitalize">{u.role}</td> */}
                    <td className="px-4 py-2 text-center">
                      {u.suggestionCount ?? 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {u.submissionCount ?? 0}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        to={`/admin/users/${userKey}`}
                        className="cursor-pointer inline-flex items-center px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>)
})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}