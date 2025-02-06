"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Post {
  id: string;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
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

export default function UserDetailPage() {
  const { postSlug } = useParams();
  const id = Number(postSlug);

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch posts for the user
        const postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`);
        if (!postsRes.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsRes.json();

        // fetch user details
        const userRes = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();

        setPosts(postsData);
        setUser(userData);
      } catch (err) {
        setError("Error fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center text-xl font-semibold py-8">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mx-auto p-6 flex flex-col space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold py-2">{user.name}</h1>
        <div>
          <span className="font-medium">Email:</span>
          <p>{user.email}</p>
        </div>

        <div>
          <span className="font-medium">Address:</span>
          <p>{user.address.street}, {user.address.city}</p>
        </div>

        <div>
          <span className="font-medium">Company:</span>
          <p>{user.company.name}</p>
        </div>

        <div>
          <span className="font-medium">Phone:</span>
          <p>{user.phone}</p>
        </div>
      </div>


      <h2 className="text-xl font-semibold mt-6">Posts by {user.name}</h2>
      <ul className="mt-4 space-y-4">
        {posts.map((post) => (
          <li key={post.id} className=" max-w-5xl border p-4 rounded-lg shadow-md bg-white">
            <h3 className="font-semibold">{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
