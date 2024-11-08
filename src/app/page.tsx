import Link from "next/link";
import Image from "next/image";
import qs from "qs";

interface ProductCardProps {
  name: string;
  description: string;
  picture: [
    {
      alternativeText: string;
      name: string;
      url: string;
    }
  ];
}

function ProductCard({
  name,
  description,
  picture,
}: Readonly<ProductCardProps>) {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337"
  }${picture[0].url}`;

  return (
    <Link href={`#`} className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={imageUrl}
        alt={picture[0].alternativeText || name}
        width={500}
        height={500}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

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
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.data.map((product: ProductCardProps) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </div>
  );
}
