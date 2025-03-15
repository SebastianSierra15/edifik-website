"use client";

import ImagesCarousel2 from "@/app/ui/realEstate/PropertyCard";

export default function TestPage() {
  const testData = [
    {
      id: 1,
      images: [
        {
          url: "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Oficina/1184/Previsualización/1739223319337/32610d5d-1b85-444f-b639-75000a182f92.webp",
          tag: "Test 1",
          projectId: 1,
        },
        {
          url: "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Lote/1183/Previsualización/1739196512448/4fa1b7d0-0dfb-4f9c-a63d-6dc19d59505a.webp",
          tag: "Test 2",
          projectId: 1,
        },
      ],
      price: 500000000,
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      parkingSpots: 1,
      url: "inmobiliaria",
    },
    {
      id: 2,
      images: [
        {
          url: "https://d3fhc8hmbgwz4k.cloudfront.net/projects/images/Local/1182/Exterior/1739135799507/5595074e-162c-494c-bab9-18920089088d.webp",
          tag: "Test 3",
          projectId: 2,
        },
      ],
      price: 750000000,
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      parkingSpots: 2,
      url: "inmobiliaria",
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 justify-center p-10 bg-gray-900 min-h-screen">
      {testData.map((data) => (
        <div key={data.id} className="w-80 h-96 bg-transparent">
          <ImagesCarousel2
            id={data.id}
            images={data.images}
            price={data.price}
            area={data.area}
            bedrooms={data.bedrooms}
            bathrooms={data.bathrooms}
            parkingSpots={data.parkingSpots}
            url={data.url}
          />
        </div>
      ))}
    </div>
  );
}
