// import { useNavigate } from "react-router-dom";

// export default function UserManagement() {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-10 min-h-screen">

//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
//           User Management
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//           {/* CREATE USER */}
//           <button
//             onClick={() => navigate("/admin/create-user")}
//             className="group relative bg-indigo-600 text-white p-10 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all"
//           >
//             <h4 className="text-2xl font-bold mb-3">Create User</h4>
//             <p className="text-indigo-100">
//               Add new employees or administrators securely.
//             </p>
//             <span className="absolute bottom-6 right-6 text-lg opacity-70 group-hover:opacity-100">
//               →
//             </span>
//           </button>

//           {/* EDIT USER */}
//           <button
//             onClick={() => navigate("/admin/edit-user")}
//             className="group relative bg-yellow-500 text-white p-10 rounded-2xl shadow-xl hover:bg-yellow-600 transition-all"
//           >
//             <h4 className="text-2xl font-bold mb-3">Edit User</h4>
//             <p className="text-yellow-100">
//               Modify roles, permissions, and profiles.
//             </p>
//             <span className="absolute bottom-6 right-6 text-lg opacity-70 group-hover:opacity-100">
//               →
//             </span>
//           </button>

//           {/* DELETE USER */}
//           <button
//             onClick={() => navigate("/admin/delete-user")}
//             className="group relative bg-red-600 text-white p-10 rounded-2xl shadow-xl hover:bg-red-700 transition-all"
//           >
//             <h4 className="text-2xl font-bold mb-3">Delete User</h4>
//             <p className="text-red-100">
//               Remove inactive or unauthorized users.
//             </p>
//             <span className="absolute bottom-6 right-6 text-lg opacity-70 group-hover:opacity-100">
//               →
//             </span>
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }
