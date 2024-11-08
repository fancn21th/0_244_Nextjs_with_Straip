import qs from "qs";

async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337";
  const path = "/api/products";

  const url = new URL(path, baseUrl);

  url.search = qs.stringify({
    populate: {
      picture: {
        fields: ["alternativeText", "name", "url"],
      },
    },
  });

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch team members");

  const data = await res.json();
  console.log(data);

  return data;
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}
