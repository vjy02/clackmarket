"use client";

import ProfileSettings from "@/components/ProfileSettings";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col px-6 py-12">
      <ProfileSettings
        initialSellerInfo={{
          name: "John Smith",
          email: "johnsmith@example.com",
          reddit: "u/johnsmith",
          discord: "johnsmith#1234",
          address: "123 Main Street, Cityville",
          paymentMethods: ["PayPal", "Bank Transfer"],
          shippingLocations: [
            {
              isGlobal: true,
              cost: "15 USD",
            },
            {
              countryId: 101,
              stateId: 202,
              cityId: undefined,
              isGlobal: false,
              cost: "10 USD",
            },
          ],
        }}
        onUpdate={(updatedInfo) => {
          console.log("Updated Seller Info:", updatedInfo);
        }}
      />
    </div>
  );
}
