"use client";

import type React from "react";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useDeferredValue,
} from "react";
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
import countryCodes from "country-codes-list";

export interface ShippingLocation {
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

// Available payment methods - moved outside component to prevent recreation
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
  const [formData, setFormData] = useState<SellerInfo>({
    ...initialSellerInfo,
  });

  // Separate immediate input values from deferred form data
  const [immediateInputs, setImmediateInputs] = useState({
    email: formData.email || "",
    username: formData.username || "",
    reddit: formData.reddit || "",
    discord: formData.discord || "",
  });

  // Defer the complex form data updates
  const deferredInputs = useDeferredValue(immediateInputs);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [shippingLocations, setShippingLocations] = useState<
    ShippingLocation[]
  >(formData.shippingLocations || []);

  const [phoneError, setPhoneError] = useState("");
  const [contactError, setContactError] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Memoize country options to prevent recreation on every render
  const countryOptions = useMemo(() => {
    const rawList = countryCodes.customList(
      "countryCode",
      "{countryCode},{countryNameEn}: +{countryCallingCode}"
    );
    return Object.values(rawList).map((str, key) => {
      const [leftPart, callingCode] = str.split(": +");
      const name = leftPart.split(",")[1];
      return { key, name, code: `+${callingCode}` };
    });
  }, []);

  // Memoize utility functions
  const formatPhoneNumber = useCallback((value: string): string => {
    const cleaned = value.replace(/[^\d]/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  }, []);

  const validatePhoneNumber = useCallback((number: string): boolean => {
    return number.length >= 5;
  }, []);

  const formatUSD = useCallback((value: string): string => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const parts = numericValue.split(".");
    if (parts.length > 1) {
      parts[1] = parts[1].slice(0, 2);
      return `$${parts[0]}${parts[1] ? "." + parts[1] : ""}`;
    }
    return numericValue ? `$${numericValue}` : "";
  }, []);

  const getFullPhoneNumber = useCallback((): string => {
    if (!phoneNumber) return "";
    return `${countryCode.split("-")[0]} ${phoneNumber}`;
  }, [countryCode, phoneNumber]);

  const validateContactMethods = useCallback((): boolean => {
    const hasEmail = formData.email && formData.email.trim() !== "";
    const hasPhone = phoneNumber && validatePhoneNumber(phoneNumber);
    const hasReddit = formData.reddit && formData.reddit.trim() !== "";
    const hasDiscord = formData.discord && formData.discord.trim() !== "";
    return hasEmail || hasPhone || hasReddit || hasDiscord;
  }, [
    formData.email,
    formData.reddit,
    formData.discord,
    phoneNumber,
    validatePhoneNumber,
  ]);

  // Memoize available payment methods
  const availablePaymentMethods = useMemo(() => {
    return PAYMENT_METHODS.filter((method) =>
      formData?.paymentMethods
        ? !formData.paymentMethods.includes(method.name)
        : true
    );
  }, [formData?.paymentMethods]);

  // Memoized event handlers
  const handleImmediateInputChange = useCallback(
    (field: string, value: string) => {
      setImmediateInputs((prev) => ({ ...prev, [field]: value }));
      if (contactError) setContactError("");
    },
    [contactError]
  );

  const updateShippingLocation = useCallback(
    (index: number, key: keyof ShippingLocation, value: any) => {
      setShippingLocations((prev) => {
        const updated = [...prev];
        updated[index][key] = value;

        if (key === "isGlobal" && value) {
          updated[index].countryId = undefined;
          updated[index].stateId = undefined;
          updated[index].cityId = undefined;
        }

        if (key === "cost") {
          updated[index][key] = formatUSD(value);
        }

        return updated;
      });
    },
    [formatUSD]
  );

  const addShippingLocation = useCallback(() => {
    setShippingLocations((prev) => [...prev, { cost: "", isGlobal: false }]);
  }, []);

  const removeShippingLocation = useCallback((index: number) => {
    setShippingLocations((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addPaymentMethod = useCallback(() => {
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
  }, [selectedPaymentMethod, formData.paymentMethods]);

  const removePaymentMethod = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((_, i) => i !== index),
    }));
  }, []);

  // Initialize phone number parsing - only run once
  useEffect(() => {
    if (shippingLocations.length > 0) {
      const formattedLocations = shippingLocations.map((loc) => ({
        ...loc,
        cost: loc.cost ? formatUSD(loc.cost) : "",
      }));
      setShippingLocations(formattedLocations);
    }

    if (formData.phone) {
      const phoneStr = formData.phone;
      const foundCode = countryOptions.find((c) => phoneStr.startsWith(c.code));

      if (foundCode) {
        setCountryCode(foundCode.code);
        setPhoneNumber(phoneStr.substring(foundCode.code.length));
      } else {
        setCountryCode("+1");
        setPhoneNumber(
          phoneStr.startsWith("+") ? phoneStr.substring(1) : phoneStr
        );
      }
    }
  }, []); // Empty dependency array - only run once

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...deferredInputs,
    }));
  }, [deferredInputs]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setPhoneError("");
      setContactError("");

      if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
        setPhoneError("Please enter a valid phone number (at least 5 digits)");
        return;
      }

      if (!validateContactMethods()) {
        setContactError(
          "Please provide at least one contact method (email, phone, Reddit, or Discord)"
        );
        return;
      }

      for (const loc of shippingLocations) {
        console.log(loc)
        if ((!loc.isGlobal && !loc.countryId) || !loc.cost) {
          alert("Please complete country/global selection and price.");
          return;
        }
      }

      const fullPhoneNumber = phoneNumber ? getFullPhoneNumber() : "";
      const payload = {
        ...formData,
        phone: fullPhoneNumber,
        shippingLocations,
      };

      onSubmit(payload);
    },
    [
      phoneNumber,
      validatePhoneNumber,
      validateContactMethods,
      shippingLocations,
      formData,
      getFullPhoneNumber,
      onSubmit,
    ]
  );

  const handlePhoneNumberChange = useCallback(
    (value: string) => {
      const formattedNumber = formatPhoneNumber(value);
      setPhoneNumber(formattedNumber);
    },
    [formatPhoneNumber]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Card */}
          <Card className="shadow-sm border bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <User className="w-5 h-5 text-cyan-600" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{contactError}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-slate-700"
                >
                  Visible Username
                </Label>
                <Input
                  id="username"
                  value={immediateInputs.username}
                  onChange={(e) =>
                    handleImmediateInputChange("username", e.target.value)
                  }
                  disabled={!!initialSellerInfo.username}
                  placeholder="username123"
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required={!initialSellerInfo.username}
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
                    value={immediateInputs.email}
                    onChange={(e) =>
                      handleImmediateInputChange("email", e.target.value)
                    }
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
                              value={`${country.code}-${country.key}`}
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
                        onChange={(e) =>
                          handlePhoneNumberChange(e.target.value)
                        }
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
                    value={immediateInputs.reddit}
                    onChange={(e) =>
                      handleImmediateInputChange("reddit", e.target.value)
                    }
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
                    value={immediateInputs.discord}
                    onChange={(e) =>
                      handleImmediateInputChange("discord", e.target.value)
                    }
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
                <Package className="w-5 h-5 text-cyan-600" />
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
                          type="button"
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
                            <Select
                              value={loc.countryId}
                              onValueChange={(value) =>
                                    updateShippingLocation(
                                      idx,
                                      "countryId",
                                      value
                                    )
                                  }
                              
                            >
                              <SelectTrigger className="bg-gray-50 border-gray-200 focus:bg-white">
                                <SelectValue placeholder="Select Region" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                <SelectItem value="Europe">Europe</SelectItem>
                                <SelectItem value="Asia">Asia</SelectItem>
                                <SelectItem value="Oceania">Oceania</SelectItem>
                                <SelectItem value="United States of America">
                                  United States of America
                                </SelectItem>
                                <SelectItem value="Canada">
                                  Canada
                                </SelectItem>
                                <SelectItem value="South America">
                                  South America
                                </SelectItem>
                              </SelectContent>
                            </Select>
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
                <CreditCard className="w-5 h-5 text-cyan-600" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData?.paymentMethods?.length > 0 && (
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
                    <SelectContent className="z-50">
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

              {formData?.paymentMethods?.length === 0 && (
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

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white h-11 px-8"
            >
              Save Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
