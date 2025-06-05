"use client";

import type React from "react";
import countries from "i18n-iso-countries";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  X,
  Package,
  CreditCard,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountrySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import type { SellerInfo } from "@/app/list/page";
import { useRouter } from "next/navigation";
import countryCodes from "country-codes-list";

interface ShippingLocation {
  countryId?: number;
  stateId?: number;
  cityId?: number;
  isGlobal?: boolean;
  cost: string;
}

interface SellerProfileFormProps {
  initialSellerInfo: SellerInfo;
  onSubmit: (sellerInfo: SellerInfo) => void;
}

// Available payment methods
const PAYMENT_METHODS = [
  { id: "paypal", name: "PayPal" },
  { id: "credit_card", name: "Credit Card" },
  { id: "bank_transfer", name: "Bank Transfer" },
  { id: "venmo", name: "Venmo" },
  { id: "cash_app", name: "Cash App" },
  { id: "zelle", name: "Zelle" },
  { id: "crypto", name: "Cryptocurrency" },
  { id: "apple_pay", name: "Apple Pay" },
  { id: "google_pay", name: "Google Pay" },
  { id: "check", name: "Check" },
  { id: "money_order", name: "Money Order" },
];

export default function ProfileSettings({
  initialSellerInfo,
  onSubmit,
}: SellerProfileFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<SellerInfo>({
    ...initialSellerInfo,
    shippingLocations: initialSellerInfo.shippingLocations || [],
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [shippingLocations, setShippingLocations] = useState<
    ShippingLocation[]
  >(formData.shippingLocations || []);

  const [phoneError, setPhoneError] = useState("");
  const [contactError, setContactError] = useState("");

  // Phone number state
  const rawList = countryCodes.customList(
    "countryCode",
    "{countryCode},{countryNameEn}: +{countryCallingCode}"
  );
  const countryOptions = Object.values(rawList).map((str, key) => {
    const [leftPart, callingCode] = str.split(": +");
    const name = leftPart.split(",")[1];
    return { key, name, code: `+${callingCode}` };
  });

  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Format phone number (just the number part, not the country code)
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  };

  // Validate phone number
  const validatePhoneNumber = (number: string): boolean => {
    // Basic validation: must have at least 5 digits
    return number.length >= 5;
  };

  // Combine country code and phone number
  const getFullPhoneNumber = (): string => {
    if (!phoneNumber) return "";
    return `${countryCode.split("-")[0]} ${phoneNumber}`;
  };

  console.log(getFullPhoneNumber());

  // Check if at least one contact method is provided
  const validateContactMethods = (): boolean => {
    const hasEmail = formData.email && formData.email.trim() !== "";
    const hasPhone = phoneNumber && validatePhoneNumber(phoneNumber);
    const hasReddit = formData.reddit && formData.reddit.trim() !== "";
    const hasDiscord = formData.discord && formData.discord.trim() !== "";

    return hasEmail || hasPhone || hasReddit || hasDiscord;
  };

  // Format USD function
  const formatUSD = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Handle decimal places
    const parts = numericValue.split(".");
    if (parts.length > 1) {
      // Limit to 2 decimal places
      parts[1] = parts[1].slice(0, 2);
      // Format with dollar sign and decimal
      return `$${parts[0]}${parts[1] ? "." + parts[1] : ""}`;
    }

    // Format with dollar sign
    return numericValue ? `$${numericValue}` : "";
  };

  const updateShippingLocation = (
    index: number,
    key: keyof ShippingLocation,
    value: any
  ) => {
    const updated = [...shippingLocations];
    updated[index][key] = value;
    if (key === "isGlobal" && value) {
      updated[index].countryId = undefined;
      updated[index].stateId = undefined;
      updated[index].cityId = undefined;
    }

    // Auto-format cost to USD if the key is cost
    if (key === "cost") {
      updated[index][key] = formatUSD(value);
    }

    setShippingLocations(updated);
  };

  const addShippingLocation = () => {
    setShippingLocations([...shippingLocations, { cost: "", isGlobal: false }]);
  };

  const removeShippingLocation = (index: number) => {
    setShippingLocations(shippingLocations.filter((_, i) => i !== index));
  };

  const addPaymentMethod = () => {
    if (
      selectedPaymentMethod &&
      !formData.paymentMethods.includes(selectedPaymentMethod)
    ) {
      const methodName =
        PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod)?.name ||
        selectedPaymentMethod;
      setFormData((prev) => ({
        ...prev,
        paymentMethods: [...prev.paymentMethods, methodName],
      }));
      setSelectedPaymentMethod("");
    }
  };

  const removePaymentMethod = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, i) => i !== index),
    }));
  };

  // Effect to auto-format existing shipping costs on component mount
  useEffect(() => {
    if (shippingLocations.length > 0) {
      const formattedLocations = shippingLocations.map((loc) => ({
        ...loc,
        cost: loc.cost ? formatUSD(loc.cost) : "",
      }));
      setShippingLocations(formattedLocations);
    }

    // Parse existing phone number if it exists
    if (formData.phone) {
      // Try to extract country code and number
      const phoneStr = formData.phone;
      // Find the country code that matches the beginning of the phone number
      const foundCode = countryOptions.find((c) => phoneStr.startsWith(c.code));

      if (foundCode) {
        setCountryCode(foundCode.code);
        setPhoneNumber(phoneStr.substring(foundCode.code.length));
      } else {
        // Default to +1 if no match
        setCountryCode("+1");
        // Remove the + if it exists at the beginning
        setPhoneNumber(
          phoneStr.startsWith("+") ? phoneStr.substring(1) : phoneStr
        );
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setPhoneError("");
    setContactError("");

    // Validate phone number if provided
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      setPhoneError("Please enter a valid phone number (at least 5 digits)");
      return;
    }

    // Validate that at least one contact method is provided
    if (!validateContactMethods()) {
      setContactError(
        "Please provide at least one contact method (email, phone, Reddit, or Discord)"
      );
      return;
    }

    // Validate shipping locations
    for (const loc of shippingLocations) {
      if (!loc.isGlobal && (!loc.countryId || !loc.stateId)) {
        alert("Please complete country and state or mark it as Global.");
        return;
      }
    }

    // Combine country code and phone number for submission
    const fullPhoneNumber = phoneNumber ? getFullPhoneNumber() : "";

    const payload = {
      ...formData,
      phone: fullPhoneNumber,
      shippingLocations,
    };

    onSubmit(payload);
    router.push("/confirmation");
  };

  // Get available payment methods (ones not already selected)
  const availablePaymentMethods = PAYMENT_METHODS.filter(
    (method) => !formData.paymentMethods.includes(method.name)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Card */}
          <Card className="shadow-sm border bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <User className="w-5 h-5 text-blue-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{contactError}</p>
                </div>
              )}
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-600">At least 1 contact information is required apart from your visible username</p>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="reddit"
                    className="text-sm font-medium text-slate-700"
                  >
                    Visible Username
                  </Label>
                  <Input
                    id="reddit"
                    value={formData.username || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }));
                      if (contactError) setContactError("");
                    }}
                    disabled={initialSellerInfo.username ? true : false}
                    placeholder="username123"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    required={initialSellerInfo.username ? false : true}
                  />
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      if (contactError) setContactError("");
                    }}
                    placeholder="you@example.com"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-slate-700"
                  >
                    Phone Number
                  </Label>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <Select
                        value={countryCode}
                        onValueChange={setCountryCode}
                      >
                        <SelectTrigger className="w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue>
                            {countryCode.split("-")[0] || "+1"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="max-h-[240px]">
                          {countryOptions.map((country) => (
                            <SelectItem
                              key={country.key}
                              value={`${country.code}-${country.key}`} // unique value
                            >
                              {country.name + ": " + country.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-2/3">
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          setPhoneNumber(formatted);
                          if (phoneError) setPhoneError("");
                          if (contactError) setContactError("");
                        }}
                        placeholder="Phone number"
                        className={`border-slate-200 focus:border-blue-500 focus:ring-blue-500 ${
                          phoneError
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="text-sm text-red-600">{phoneError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="reddit"
                    className="text-sm font-medium text-slate-700"
                  >
                    Reddit Username
                  </Label>
                  <Input
                    id="reddit"
                    value={formData.reddit || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        reddit: e.target.value,
                      }));
                      if (contactError) setContactError("");
                    }}
                    placeholder="u/username"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="discord"
                    className="text-sm font-medium text-slate-700"
                  >
                    Discord Username
                  </Label>
                  <Input
                    id="discord"
                    value={formData.discord || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        discord: e.target.value,
                      }));
                      if (contactError) setContactError("");
                    }}
                    placeholder="yourname#1234"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Locations Card */}
          <Card className="shadow-sm border bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Package className="w-5 h-5 text-green-600" />
                Shipping Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {shippingLocations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No shipping locations added yet</p>
                  <p className="text-sm">
                    Add your first shipping location to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shippingLocations.map((loc, idx) => (
                    <Card key={idx} className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-slate-900">
                            Location #{idx + 1}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeShippingLocation(idx)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`global-${idx}`}
                              checked={loc.isGlobal || false}
                              onChange={(e) =>
                                updateShippingLocation(
                                  idx,
                                  "isGlobal",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <Label
                              htmlFor={`global-${idx}`}
                              className="text-sm font-medium text-slate-700"
                            >
                              Global Shipping (Worldwide)
                            </Label>
                          </div>

                          {!loc.isGlobal && (
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2 relative">
                                <Label className="text-sm font-medium text-slate-700">
                                  Country
                                </Label>
                                <CountrySelect
                                  onChange={(e) =>
                                    updateShippingLocation(
                                      idx,
                                      "countryId",
                                      e.id
                                    )
                                  }
                                  placeHolder="Select Country"
                                  containerClassName="no-border"
                                  inputClassName="no-border"
                                />
                              </div>
                              {loc.countryId && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-slate-700">
                                    State/Province
                                  </Label>
                                  <StateSelect
                                    countryid={loc.countryId}
                                    onChange={(e) =>
                                      updateShippingLocation(
                                        idx,
                                        "stateId",
                                        e.id
                                      )
                                    }
                                    placeHolder="Select State"
                                    containerClassName="no-border"
                                    inputClassName="no-border"
                                  />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">
                              Shipping Cost (USD)
                            </Label>
                            <Input
                              placeholder="$0.00"
                              value={loc.cost}
                              onChange={(e) =>
                                updateShippingLocation(
                                  idx,
                                  "cost",
                                  e.target.value
                                )
                              }
                              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <Button
                onClick={addShippingLocation}
                variant="outline"
                type="button"
                className="w-full border-dashed border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Shipping Location
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods Card */}
          <Card className="shadow-sm border bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.paymentMethods.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.paymentMethods.map((method, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      {method}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePaymentMethod(index)}
                        className="h-auto p-0 hover:bg-transparent text-slate-500 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    value={selectedPaymentMethod}
                    onValueChange={setSelectedPaymentMethod}
                  >
                    <SelectTrigger className="w-full border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePaymentMethods.length > 0 ? (
                        availablePaymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          All payment methods added
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={addPaymentMethod}
                  type="button"
                  variant="outline"
                  className="border-slate-200 hover:bg-slate-50"
                  disabled={
                    !selectedPaymentMethod ||
                    availablePaymentMethods.length === 0
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {formData.paymentMethods.length === 0 && (
                <div className="text-center py-6 text-slate-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No payment methods added yet</p>
                  <p className="text-sm">
                    Select payment methods your customers can use
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-sm border bg-white/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Save Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
