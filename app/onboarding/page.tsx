import ProfileSettings from "@/components/ProfileSettings";

export const Onboarding = () => {
  const initSeller = {
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethods: [],
    discord: "",
    username: "",
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-50 to-slate-100 overflow-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to ClackMarket</h1>
        <h3 className="text-lg mb-6">Fill in the form to get started.</h3>
        <ProfileSettings initialSellerInfo={initSeller} />
      </div>
    </div>
  );
};

export default Onboarding;
