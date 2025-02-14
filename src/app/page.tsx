// app/page.tsx
"use client";
import { BeakerIcon } from "@heroicons/react/24/solid";

function Example() {
  return <BeakerIcon className="h-5 w-5 text-blue-500" />;
}

import { useQuery } from "@tanstack/react-query";
import TestSupabase from "./component/testSupabase";

async function fetchData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  return await res.json();
}
type Post = {
  id: number;
  title: string;
  body: string;
};
export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posrt"],
    queryFn: async (): Promise<Array<Post>> => {
      return await fetchData();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <TestSupabase />
      <BeakerIcon height={100} />
      {data &&
        data.map((post) => (
          <p key={post.id}>
            <a href="#">{post.title}</a>
          </p>
        ))}
    </div>
  );
}
