import { showToast } from '@/redux/Slices/ToastSlice';
import { getCookie } from '@/utils';
import { CheckCircle } from 'lucide-react';
import { TrashIcon, BanIcon } from 'lucide-react';
import nProgress from 'nprogress';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminHome = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllUsers = async () => {
            const access = getCookie('accessToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/get/all-users`, {
                headers: {
                    'Authorization': 'Bearer ' + access
                }
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {
                setUsers(data);
            } else {
                dispatch(showToast({ type: 'e', message: data.message }));
            }
        };
        fetchAllUsers();
    }, [dispatch]);

    const deleteUser = async (id) => {
        const access = getCookie('accessToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + access
            }
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setUsers(data.users);
            dispatch(showToast({ type: 's', message: 'User deleted successfully' }));
        }
    };


    const banUser = async (id,message) => {
        nProgress.start()
        const access = getCookie('accessToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/ban/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + access
            }
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setUsers(data.users);
            dispatch(showToast({ type: 's', message: 'User is '+message }));
        }
        nProgress.done()

    }

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toString().includes(searchTerm.toLowerCase()) ||
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="relative overflow-x-auto h-96 overflow-y-auto border shadow-xl bg-muted/40 mt-16 rounded-lg">
            <div className="flex justify-between items-center p-3 sticky top-0 bg-muted/50 backdrop-blur-md backdrop-saturate-150 border   shadow-lg">
                <h2 className="text-xl font-semibold">Users</h2>
                <input
                    type="text"
                    placeholder="Search Users..."
                    className="px-4 py-2 border-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="w-full text-sm text-left ">
                <thead className="text-xs uppercase sticky top-16 bg-muted">
                    <tr>
                        <th scope="col" className="px-6 py-3">User ID</th>
                        <th scope="col" className="px-6 py-3">Username</th>
                        <th scope="col" className="px-6 py-3">Full Name</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user, index) => (
                        <tr key={index} className="border-b">
                            <td className="px-6 py-4">{user.id}</td>
                            <td className="px-6 py-4 font-medium">
                                <Link to={`/profile/${user.username}`} className="text-blue-500 hover:underline">
                                    {user.username}
                                </Link>
                            </td>
                            <td className="px-6 py-4">{user.full_name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    className={`text-red-500 hover:text-red-700 mx-2 ${user.user_status === 'admin' ? 'cursor-not-allowed opacity-50' : ''}`}
                                    aria-label="Delete"
                                    onClick={() => deleteUser(user.id)}
                                    disabled={user.user_status === 'admin'}
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                                <button
                                    className={`text-yellow-500 hover:text-yellow-700 mx-2 ${user.user_status === 'admin' ? 'cursor-not-allowed opacity-50' : ''}`}
                                    aria-label="Ban"
                                    onClick={()=>{banUser(user.id , user.banned?"Unbanned":"banned")}}
                                    disabled={user.user_status === 'admin'}
                                >
                                    {user.banned ? <CheckCircle className="w-5 h-5 text-green-500 hover:text-green-700" />  : <BanIcon className="w-5 h-5" />}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-4 text-center border">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default AdminHome;
