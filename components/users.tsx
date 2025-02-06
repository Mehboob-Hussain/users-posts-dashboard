"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: {
    name: string;
  };
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // fetch users data from API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // filter users based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercasedQuery) ||
          user.email.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  return (
    <div className="max-w-6xl flex flex-col space-y-4">
      <h1 className="text-3xl font-bold text-center">Users</h1>

      <div className="py-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 px-4 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        // skeleton loader
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="border p-6 rounded-lg shadow-md bg-gray-100 animate-pulse h-32"></div>
          ))}
        </div>
      ) : error ? (
        // error message
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="border p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-700">{user.email}</p>
              <p className="text-gray-500">
                {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}
              </p>
              <p className="text-gray-500">{user.company.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;







