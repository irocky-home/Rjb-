import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import PDFPreviewModal from "./PDFPreviewModal";

import { generateTransactionIds } from "@/lib/transactionUtils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  CurrencyDollar,
  Envelope,
  Eye,
  Globe,
  Phone,
  User,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";

const COUNTRY_DATA = [
  { code: 'GH', name: 'Ghana', currency: 'GHS', phoneCode: '+233', flag: '🇬🇭', symbol: '₵' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', phoneCode: '+234', flag: '🇳🇬', symbol: '₦' },
  { code: 'KE', name: 'Kenya', currency: 'KES', phoneCode: '+254', flag: '🇰🇪', symbol: 'KSh' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', phoneCode: '+63', flag: '🇵🇭', symbol: '₱' },
  { code: 'IN', name: 'India', currency: 'INR', phoneCode: '+91', flag: '🇮🇳', symbol: '₹' },
  { code: 'US', name: 'United States', currency: 'USD', phoneCode: '+1', flag: '🇺🇸', symbol: '$' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', phoneCode: '+44', flag: '🇬🇧', symbol: '£' },
  { code: 'CA', name: 'Canada', currency: 'CAD', phoneCode: '+1', flag: '🇨🇦', symbol: 'C$' },
  { code: 'AU', name: 'Australia', currency: 'AUD', phoneCode: '+61', flag: '🇦🇺', symbol: 'A$' },
  { code: 'DE', name: 'Germany', currency: 'EUR', phoneCode: '+49', flag: '🇩🇪', symbol: '€' },
  { code: 'JP', name: 'Japan', currency: 'JPY', phoneCode: '+81', flag: '🇯🇵', symbol: '¥' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', phoneCode: '+41', flag: '🇨🇭', symbol: 'CHF' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', phoneCode: '+27', flag: '🇿🇦', symbol: 'R' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', phoneCode: '+971', flag: '🇦🇪', symbol: 'د.إ' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', phoneCode: '+966', flag: '🇸🇦', symbol: '﷼' },
  { code: 'EG', name: 'Egypt', currency: 'EGP', phoneCode: '+20', flag: '🇪🇬', symbol: 'E£' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', phoneCode: '+52', flag: '🇲🇽', symbol: 'Mex$' },
  { code: 'BR', name: 'Brazil', currency: 'BRL', phoneCode: '+55', flag: '🇧🇷', symbol: 'R$' },
  { code: 'CN', name: 'China', currency: 'CNY', phoneCode: '+86', flag: '🇨🇳', symbol: '¥' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', phoneCode: '+46', flag: '🇸🇪', symbol: 'kr' },
  { code: 'NO', name: 'Norway', currency: 'NOK', phoneCode: '+47', flag: '🇳🇴', symbol: 'kr' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', phoneCode: '+45', flag: '🇩🇰', symbol: 'kr' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', phoneCode: '+65', flag: '🇸🇬', symbol: 'S$' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', phoneCode: '+852', flag: '🇭🇰', symbol: 'HK$' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', phoneCode: '+64', flag: '🇳🇿', symbol: 'NZ$' },
  { code: 'TH', name: 'Thailand', currency: 'THB', phoneCode: '+66', flag: '🇹🇭', symbol: '฿' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', phoneCode: '+60', flag: '🇲🇾', symbol: 'RM' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', phoneCode: '+62', flag: '🇮🇩', symbol: 'Rp' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', phoneCode: '+92', flag: '🇵🇰', symbol: '₨' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', phoneCode: '+880', flag: '🇧🇩', symbol: '৳' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR', phoneCode: '+94', flag: '🇱🇰', symbol: 'Rs' },
  { code: 'NP', name: 'Nepal', currency: 'NPR', phoneCode: '+977', flag: '🇳🇵', symbol: '₨' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', phoneCode: '+84', flag: '🇻🇳', symbol: '₫' },
  { code: 'TR', name: 'Turkey', currency: 'TRY', phoneCode: '+90', flag: '🇹🇷', symbol: '₺' },
  { code: 'RU', name: 'Russia', currency: 'RUB', phoneCode: '+7', flag: '🇷🇺', symbol: '₽' },
  { code: 'PL', name: 'Poland', currency: 'PLN', phoneCode: '+48', flag: '🇵🇱', symbol: 'zł' },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK', phoneCode: '+420', flag: '🇨🇿', symbol: 'Kč' },
  { code: 'HU', name: 'Hungary', currency: 'HUF', phoneCode: '+36', flag: '🇭🇺', symbol: 'Ft' },
  { code: 'RO', name: 'Romania', currency: 'RON', phoneCode: '+40', flag: '🇷🇴', symbol: 'lei' },
  { code: 'BG', name: 'Bulgaria', currency: 'BGN', phoneCode: '+359', flag: '🇧🇬', symbol: 'лв' },
  { code: 'HR', name: 'Croatia', currency: 'HRK', phoneCode: '+385', flag: '🇭🇷', symbol: 'kn' },
  { code: 'RS', name: 'Serbia', currency: 'RSD', phoneCode: '+381', flag: '🇷🇸', symbol: 'дин' },
  { code: 'UA', name: 'Ukraine', currency: 'UAH', phoneCode: '+380', flag: '🇺🇦', symbol: '₴' },
  { code: 'KZ', name: 'Kazakhstan', currency: 'KZT', phoneCode: '+7', flag: '🇰🇿', symbol: '₸' },
  { code: 'UZ', name: 'Uzbekistan', currency: 'UZS', phoneCode: '+998', flag: '🇺🇿', symbol: 'сум' },
  { code: 'AZ', name: 'Azerbaijan', currency: 'AZN', phoneCode: '+994', flag: '🇦🇿', symbol: '₼' },
  { code: 'GE', name: 'Georgia', currency: 'GEL', phoneCode: '+995', flag: '🇬🇪', symbol: '₾' },
  { code: 'AM', name: 'Armenia', currency: 'AMD', phoneCode: '+374', flag: '🇦🇲', symbol: '֏' },
  { code: 'KG', name: 'Kyrgyzstan', currency: 'KGS', phoneCode: '+996', flag: '🇰🇬', symbol: 'с' },
  { code: 'TJ', name: 'Tajikistan', currency: 'TJS', phoneCode: '+992', flag: '🇹🇯', symbol: 'ЅМ' },
  { code: 'TM', name: 'Turkmenistan', currency: 'TMT', phoneCode: '+993', flag: '🇹🇲', symbol: 'm' },
  { code: 'BY', name: 'Belarus', currency: 'BYN', phoneCode: '+375', flag: '🇧🇾', symbol: 'Br' },
  { code: 'MD', name: 'Moldova', currency: 'MDL', phoneCode: '+373', flag: '🇲🇩', symbol: 'L' },
  { code: 'AL', name: 'Albania', currency: 'ALL', phoneCode: '+355', flag: '🇦🇱', symbol: 'L' },
  { code: 'BA', name: 'Bosnia and Herzegovina', currency: 'BAM', phoneCode: '+387', flag: '🇧🇦', symbol: 'KM' },
  { code: 'MK', name: 'North Macedonia', currency: 'MKD', phoneCode: '+389', flag: '🇲🇰', symbol: 'ден' },
  { code: 'ME', name: 'Montenegro', currency: 'EUR', phoneCode: '+382', flag: '🇲🇪', symbol: '€' },
  { code: 'XK', name: 'Kosovo', currency: 'EUR', phoneCode: '+383', flag: '🇽🇰', symbol: '€' },
  { code: 'IS', name: 'Iceland', currency: 'ISK', phoneCode: '+354', flag: '🇮🇸', symbol: 'kr' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', phoneCode: '+353', flag: '🇮🇪', symbol: '€' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', phoneCode: '+351', flag: '🇵🇹', symbol: '€' },
  { code: 'ES', name: 'Spain', currency: 'EUR', phoneCode: '+34', flag: '🇪🇸', symbol: '€' },
  { code: 'FR', name: 'France', currency: 'EUR', phoneCode: '+33', flag: '🇫🇷', symbol: '€' },
  { code: 'IT', name: 'Italy', currency: 'EUR', phoneCode: '+39', flag: '🇮🇹', symbol: '€' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', phoneCode: '+32', flag: '🇧🇪', symbol: '€' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', phoneCode: '+31', flag: '🇳🇱', symbol: '€' },
  { code: 'LU', name: 'Luxembourg', currency: 'EUR', phoneCode: '+352', flag: '🇱🇺', symbol: '€' },
  { code: 'AT', name: 'Austria', currency: 'EUR', phoneCode: '+43', flag: '🇦🇹', symbol: '€' },
  { code: 'GR', name: 'Greece', currency: 'EUR', phoneCode: '+30', flag: '🇬🇷', symbol: '€' },
  { code: 'CY', name: 'Cyprus', currency: 'EUR', phoneCode: '+357', flag: '🇨🇾', symbol: '€' },
  { code: 'MT', name: 'Malta', currency: 'EUR', phoneCode: '+356', flag: '🇲🇹', symbol: '€' },
  { code: 'FI', name: 'Finland', currency: 'EUR', phoneCode: '+358', flag: '🇫🇮', symbol: '€' },
  { code: 'EE', name: 'Estonia', currency: 'EUR', phoneCode: '+372', flag: '🇪🇪', symbol: '€' },
  { code: 'LV', name: 'Latvia', currency: 'EUR', phoneCode: '+371', flag: '🇱🇻', symbol: '€' },
  { code: 'LT', name: 'Lithuania', currency: 'EUR', phoneCode: '+370', flag: '🇱🇹', symbol: '€' },
  { code: 'SK', name: 'Slovakia', currency: 'EUR', phoneCode: '+421', flag: '🇸🇰', symbol: '€' },
  { code: 'SI', name: 'Slovenia', currency: 'EUR', phoneCode: '+386', flag: '🇸🇮', symbol: '€' },
  { code: 'AD', name: 'Andorra', currency: 'EUR', phoneCode: '+376', flag: '🇦🇩', symbol: '€' },
  { code: 'SM', name: 'San Marino', currency: 'EUR', phoneCode: '+378', flag: '🇸🇲', symbol: '€' },
  { code: 'VA', name: 'Vatican City', currency: 'EUR', phoneCode: '+379', flag: '🇻🇦', symbol: '€' },
  { code: 'MC', name: 'Monaco', currency: 'EUR', phoneCode: '+377', flag: '🇲🇨', symbol: '€' },
  { code: 'LI', name: 'Liechtenstein', currency: 'CHF', phoneCode: '+423', flag: '🇱🇮', symbol: 'CHF' },
  { code: 'GI', name: 'Gibraltar', currency: 'GBP', phoneCode: '+350', flag: '🇬🇮', symbol: '£' },
  { code: 'IM', name: 'Isle of Man', currency: 'GBP', phoneCode: '+44', flag: '🇮🇲', symbol: '£' },
  { code: 'JE', name: 'Jersey', currency: 'GBP', phoneCode: '+44', flag: '🇯🇪', symbol: '£' },
  { code: 'GG', name: 'Guernsey', currency: 'GBP', phoneCode: '+44', flag: '🇬🇬', symbol: '£' },
];

const getCurrencyInfoByCode = (currencyCode: string) => {
  return COUNTRY_DATA.find(c => c.currency === currencyCode);
};

const getCurrencySymbol = (currencyCode: string) => {
  return getCurrencyInfoByCode(currencyCode)?.symbol || currencyCode;
};

interface TransactionData {
  id: string;
  clientName: string;
  clientEmail?: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  fee: number;
  status: string;
  createdAt: string;
  receiptPrinted?: boolean;
  phoneNumber?: string;
  transactionType: "send" | "receive";
  uniqueId: string;
  formatId: string;
}

interface CreateTransactionProps {
  onClose: () => void;
  onComplete: (transaction: TransactionData) => void;
  exchangeRates: Array<{
    pair: string;
    rate: number;
    change: number;
    changePercent: number;
    lastUpdated: string;
    region: string;
  }>;
}

const CreateTransaction: React.FC<CreateTransactionProps> = ({
  onClose,
  onComplete,
  exchangeRates,
}) => {
  const [step, setStep] = useState<
    | "type"
    | "country"
    | "details"
    | "review"
    | "loading"
    | "receiver"
    | "complete"
  >("type");
  const [transactionType, setTransactionType] = useState<
    "send" | "receive" | null
  >(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTransaction, setGeneratedTransaction] =
    useState<TransactionData | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    amount: "",
    phoneNumber: "",
  });

  const [receiverFormData, setReceiverFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [showPDFPreview, setShowPDFPreview] = useState(false);

  // Get popular countries based on transaction history
  const getPopularCountries = () => {
    const popularPairs = [
      "USD/GHS",
      "USD/NGN",
      "USD/INR",
      "USD/PHP",
      "USD/KES",
      "USD/EUR",
      "USD/GBP",
      "USD/CAD",
      "USD/AUD",
      "USD/JPY",
    ];

    return exchangeRates
      .filter((rate) => popularPairs.includes(rate.pair))
      .sort(
        (a, b) => popularPairs.indexOf(a.pair) - popularPairs.indexOf(b.pair)
      );
  };

  const getCountryFlag = (currencyPair: string) => {
    const currency = currencyPair.split("/")[1];
    return getCurrencyInfoByCode(currency)?.flag || "🌍";
  };

  const getCountryName = (currencyPair: string) => {
    const currency = currencyPair.split("/")[1];
    return getCurrencyInfoByCode(currency)?.name || "International";
  };

  const getCurrencySymbolForPair = (currencyPair: string) => {
    const currency = currencyPair.split("/")[1];
    return getCurrencySymbol(currency);
  };

  const handleCreateTransaction = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate secure connection

      const selectedRate = exchangeRates.find(
        (rate) => rate.pair === selectedCountry
      );
      if (!selectedRate) throw new Error("Exchange rate not found");

      // Use the new transaction ID generation utility
      const currency = selectedCountry.split("/")[1];
      const { formatId, uniqueId } = generateTransactionIds(
        currency,
        formData.phoneNumber
      );
      const amount = parseFloat(formData.amount);
      const fee = amount * 0.00; // 0% fee

      const transaction: TransactionData = {
        id: `TXN-${Date.now()}`,
        clientName: formData.fullName,
        clientEmail: formData.email,
        amount,
        fromCurrency: selectedCountry.split("/")[0],
        toCurrency: currency,
        exchangeRate: selectedRate.rate,
        fee,
        status: "completed",
        createdAt: new Date().toISOString(),
        phoneNumber: formData.phoneNumber,
        transactionType: transactionType!,
        uniqueId,
        formatId,
        receiptPrinted: false,
      };

      setGeneratedTransaction(transaction);
      setStep("loading");
      toast.success("Transaction created successfully!");

      // Show loading animation for 2 seconds, then proceed to receiver info
      setTimeout(() => {
        setStep("receiver");
      }, 2000);
    } catch {
      toast.error("Failed to create transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTransactionTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Choose Transaction Type</h3>
        <p className="text-muted-foreground">
          Select whether you want to send or receive money
        </p>
      </div>

      <div className="grid gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            transactionType === "send"
              ? "ring-2 ring-primary border-primary"
              : ""
          }`}
          onClick={() => setTransactionType("send")}
        >
          <CardContent className="p-6 text-center">
            <ArrowRight
              className="h-8 w-8 mx-auto mb-3 text-primary"
              weight="duotone"
            />
            <h4 className="font-semibold text-lg mb-2">Send Money</h4>
            <p className="text-sm text-muted-foreground">
              Send money to someone in another country
            </p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            transactionType === "receive"
              ? "ring-2 ring-primary border-primary"
              : ""
          }`}
          onClick={() => setTransactionType("receive")}
        >
          <CardContent className="p-6 text-center">
            <ArrowLeft
              className="h-8 w-8 mx-auto mb-3 text-primary"
              weight="duotone"
            />
            <h4 className="font-semibold text-lg mb-2">Receive Money</h4>
            <p className="text-sm text-muted-foreground">
              Receive money from someone abroad
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => setStep("country")}
          disabled={!transactionType}
          className="min-w-[120px]"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderCountryStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Select Country</h3>
        <p className="text-muted-foreground">
          Choose the country for your transaction
        </p>
      </div>

      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {getPopularCountries().map((rate) => (
          <Card
            key={rate.pair}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCountry === rate.pair
                ? "ring-2 ring-primary border-primary"
                : ""
            }`}
            onClick={() => setSelectedCountry(rate.pair)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCountryFlag(rate.pair)}</span>
                  <div>
                    <h4 className="font-medium">{getCountryName(rate.pair)}</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {rate.pair}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{rate.rate.toFixed(4)}</div>
                  <div
                    className={`text-xs ${
                      rate.changePercent > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {rate.changePercent > 0 ? "+" : ""}
                    {rate.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("type")}>
          Back
        </Button>
        <Button
          onClick={() => setStep("details")}
          disabled={!selectedCountry}
          className="min-w-[120px]"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Transaction Details</h3>
        <p className="text-muted-foreground">
          Enter the transaction information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder="Enter full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Envelope className="h-4 w-4" />
            Email (Optional)
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Enter email address"
          />
        </div>

        <div>
          <Label htmlFor="amount" className="flex items-center gap-2">
            <CurrencyDollar className="h-4 w-4" />
            Amount *
          </Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("country")}>
          Back
        </Button>
        <Button
          onClick={() => setStep("review")}
          disabled={!formData.fullName || !formData.amount}
          className="min-w-[120px]"
        >
          Review
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const selectedRate = exchangeRates.find(
      (rate) => rate.pair === selectedCountry
    );
    const amount = parseFloat(formData.amount || "0");
    const fee = amount * 0.025;
    const totalReceived = amount * (selectedRate?.rate || 1);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Review Transaction</h3>
          <p className="text-muted-foreground">
            Please review the details before proceeding
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Transaction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Type</Label>
                <div className="font-medium capitalize flex items-center gap-2">
                  {transactionType === "send" ? <>📤 Send</> : <>📥 Receive</>}
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Country</Label>
                <div className="font-medium flex items-center gap-2">
                  {getCountryFlag(selectedCountry)}{" "}
                  {getCountryName(selectedCountry)}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Full Name:</span>
                  <span className="font-medium">{formData.fullName}</span>
                </div>
                {formData.email && (
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Exchange Rate:</span>
                  <span className="font-medium">
                    {selectedRate?.rate.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fee:</span>
                  <span className="font-medium">${fee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Received:</span>
                    <span className="text-primary">{getCurrencySymbolForPair(selectedCountry)}
                      {selectedCountry.split("/")[1]} {totalReceived.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("details")}>
            Back
          </Button>
          <Button
            onClick={handleCreateTransaction}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 animate-spin" />
                Creating...
              </div>
            ) : (
              "Create Transaction"
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderLoadingStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <CheckCircle
            className="h-8 w-8 text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            weight="duotone"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          Processing Transaction...
        </h3>
        <p className="text-muted-foreground">
          Please wait while we secure your transaction
        </p>
      </div>
    </div>
  );

  const renderReceiverStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Receiver Information</h3>
          <p className="text-muted-foreground">
            Enter the receiver's details to complete the transaction
          </p>
        </div>

        {/* Preview Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPDFPreview(true)}
            className="rounded-full p-2 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="receiverFullName"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Receiver Full Name *
            </Label>
            <Input
              id="receiverFullName"
              value={receiverFormData.fullName}
              onChange={(e) =>
                setReceiverFormData((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
              placeholder="Enter receiver's full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="receiverEmail" className="flex items-center gap-2">
              <Envelope className="h-4 w-4" />
              Receiver Email (Optional)
            </Label>
            <Input
              id="receiverEmail"
              type="email"
              value={receiverFormData.email}
              onChange={(e) =>
                setReceiverFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="Enter receiver's email address"
            />
          </div>

          <div>
            <Label
              htmlFor="receiverPhoneNumber"
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Receiver Phone Number
            </Label>
            <Input
              id="receiverPhoneNumber"
              type="tel"
              value={receiverFormData.phoneNumber}
              onChange={(e) =>
                setReceiverFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
              placeholder="Enter receiver's phone number"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("review")}>
            Back
          </Button>
          <Button
            onClick={() => {
              if (generatedTransaction) {
                onComplete(generatedTransaction);
                setStep("complete");
              }
            }}
            disabled={!receiverFormData.fullName}
            className="min-w-[120px]"
          >
            Complete Transaction
          </Button>
        </div>
      </div>
    );
  };

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center">
        <CheckCircle
          className="h-16 w-16 text-green-500 mb-4"
          weight="duotone"
        />
        <h3 className="text-xl font-semibold mb-2">
          Transaction Completed Successfully!
        </h3>
        <p className="text-muted-foreground">
          Your transaction has been processed and completed
        </p>
      </div>

      {generatedTransaction && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">
                    Transaction ID
                  </Label>
                  <div className="font-mono font-bold">
                    {generatedTransaction.uniqueId}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reference</Label>
                  <div className="font-mono text-xs">
                    {generatedTransaction.formatId}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // Print functionality could be added here
                    toast.success(
                      "Print receipt functionality will be implemented"
                    );
                  }}
                >
                  Print Receipt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button
          onClick={() => {
            setStep("type");
            setTransactionType(null);
            setSelectedCountry("");
            setFormData({
              fullName: "",
              email: "",
              amount: "",
              phoneNumber: "",
            });
            setReceiverFormData({ fullName: "", email: "", phoneNumber: "" });
            setGeneratedTransaction(null);
          }}
        >
          Create Another
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <Card className="w-full max-w-2xl border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">New Transaction</CardTitle>
                  <CardDescription>
                    Create a new money transfer transaction
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress indicator */}
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2">
                  {[
                    "type",
                    "country",
                    "details",
                    "review",
                    "loading",
                    "receiver",
                    "complete",
                  ].map((stepName, index) => {
                    const currentIndex = [
                      "type",
                      "country",
                      "details",
                      "review",
                      "loading",
                      "receiver",
                      "complete",
                    ].indexOf(step);
                    const isActive = index === currentIndex;
                    const isCompleted = index < currentIndex;

                    return (
                      <div
                        key={stepName}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          isActive
                            ? "bg-primary"
                            : isCompleted
                            ? "bg-primary/60"
                            : "bg-muted"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {step === "type" && renderTransactionTypeStep()}
              {step === "country" && renderCountryStep()}
              {step === "details" && renderDetailsStep()}
              {step === "review" && renderReviewStep()}
              {step === "loading" && renderLoadingStep()}
              {step === "receiver" && renderReceiverStep()}
              {step === "complete" && renderCompleteStep()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {generatedTransaction && (
        <PDFPreviewModal
          isOpen={showPDFPreview}
          onClose={() => setShowPDFPreview(false)}
          transaction={{
            ...generatedTransaction,
            countryName: getCountryName(selectedCountry),
            countryFlag: getCountryFlag(selectedCountry),
          }}
          isReceiver={step === "receiver"}
        />
      )}
    </>
  );
};

export default CreateTransaction;
