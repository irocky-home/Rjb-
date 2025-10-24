 import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowsClockwise, 
  TrendUp, 
  TrendDown,
  Calculator,
  Eye,
  EyeSlash,
  X
} from '@phosphor-icons/react';

interface ExchangeRate {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  region: 'africa' | 'asia' | 'europe' | 'north-america' | 'south-america' | 'oceania' | 'middle-east';
}

interface AutoConversionWidgetProps {
  exchangeRates: ExchangeRate[];
  onRefreshRates: () => Promise<void>;
  isRefreshing: boolean;
  className?: string;
}

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

interface ConversionPair {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  isVisible: boolean;
}

const AutoConversionWidget: React.FC<AutoConversionWidgetProps> = ({
  exchangeRates,
  onRefreshRates,
  isRefreshing,
  className = ''
}) => {
  const [conversionPairs, setConversionPairs] = useState<ConversionPair[]>([
    { id: '1', fromCurrency: 'USD', toCurrency: 'GHS', amount: 1000, isVisible: true },
    { id: '2', fromCurrency: 'USD', toCurrency: 'NGN', amount: 500, isVisible: true },
    { id: '3', fromCurrency: 'USD', toCurrency: 'KES', amount: 1000, isVisible: true }
  ]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Get currency flag
  const getCurrencyFlag = (currency: string) => {
    const flagMap: { [key: string]: string } = {
      'USD': '🇺🇸', 'EUR': '🇪🇺', 'GBP': '🇬🇧', 'JPY': '🇯🇵',
      'GHS': '🇬🇭', 'NGN': '🇳🇬', 'KES': '🇰🇪', 'ZAR': '🇿🇦',
      'INR': '🇮🇳', 'PHP': '🇵🇭', 'CNY': '🇨🇳', 'CAD': '🇨🇦',
      'AUD': '🇦🇺', 'CHF': '🇨🇭', 'BRL': '🇧🇷', 'MXN': '🇲🇽'
    };
    return flagMap[currency] || '🌍';
  };

  // Find exchange rate
  const findExchangeRate = (from: string, to: string): number | null => {
    if (from === to) return 1;

    // Direct pair
    let rate = exchangeRates.find(r => r.pair === `${from}/${to}`);
    if (rate) return rate.rate;

    // Inverse pair
    rate = exchangeRates.find(r => r.pair === `${to}/${from}`);
    if (rate) return 1 / rate.rate;

    // Cross-currency via USD
    if (from !== 'USD' && to !== 'USD') {
      const fromUsdRate = exchangeRates.find(r => r.pair === `USD/${from}` || r.pair === `${from}/USD`);
      const toUsdRate = exchangeRates.find(r => r.pair === `USD/${to}` || r.pair === `${to}/USD`);

      if (fromUsdRate && toUsdRate) {
        const fromRate = fromUsdRate.pair === `USD/${from}` ? fromUsdRate.rate : 1 / fromUsdRate.rate;
        const toRate = toUsdRate.pair === `USD/${to}` ? toUsdRate.rate : 1 / toUsdRate.rate;
        return toRate / fromRate;
      }
    }

    return null;
  };

  // Get rate change info
  const getRateChangeInfo = (from: string, to: string) => {
    const pair = exchangeRates.find(r => 
      r.pair === `${from}/${to}` || r.pair === `${to}/${from}`
    );
    
    if (pair) {
      const isInverse = pair.pair === `${to}/${from}`;
      return {
        change: isInverse ? -pair.change : pair.change,
        changePercent: isInverse ? -pair.changePercent : pair.changePercent,
        lastUpdated: pair.lastUpdated
      };
    }
    
    return { change: 0, changePercent: 0, lastUpdated: new Date().toISOString() };
  };

  // Auto refresh rates
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      onRefreshRates();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isAutoRefresh, onRefreshRates]);

  // Update conversion pair amount
  const updatePairAmount = (id: string, amount: number) => {
    setConversionPairs(prev => 
      prev.map(pair => 
        pair.id === id ? { ...pair, amount } : pair
      )
    );
  };

  // Toggle pair visibility
  const togglePairVisibility = (id: string) => {
    setConversionPairs(prev => 
      prev.map(pair => 
        pair.id === id ? { ...pair, isVisible: !pair.isVisible } : pair
      )
    );
  };

  // Remove conversion pair with X button
  const removePair = (id: string) => {
    setConversionPairs(prev => prev.filter(pair => pair.id !== id));
  };

  return (
    <Card className={`auto-conversion-widget card-dark-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" weight="duotone" />
            Auto Conversions
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={isAutoRefresh ? "default" : "outline"} 
              className="text-xs cursor-pointer"
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            >
              {isAutoRefresh ? 'Auto' : 'Manual'}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshRates}
              disabled={isRefreshing}
              className="h-7 w-7 p-0"
            >
              <ArrowsClockwise 
                className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} 
                weight="bold" 
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {conversionPairs.map((pair) => {
          const rate = findExchangeRate(pair.fromCurrency, pair.toCurrency);
          const convertedAmount = rate ? pair.amount * rate : 0;
          const rateInfo = getRateChangeInfo(pair.fromCurrency, pair.toCurrency);
          
          return (
            <div
              key={pair.id}
              className={`conversion-pair p-4 rounded-lg border transition-all duration-300 ${
                pair.isVisible 
                  ? 'bg-muted/20 border-border' 
                  : 'bg-muted/5 border-muted opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCurrencyFlag(pair.fromCurrency)}</span>
                    <span className="font-mono text-sm font-semibold">
                      {pair.fromCurrency}
                    </span>
                  </div>
                  
                  <div className="text-muted-foreground">→</div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCurrencyFlag(pair.toCurrency)}</span>
                    <span className="font-mono text-sm font-semibold">
                      {pair.toCurrency}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePairVisibility(pair.id)}
                    className="h-6 w-6 p-0"
                  >
                    {pair.isVisible ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeSlash className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePair(pair.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                    title="Remove pair"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {pair.isVisible && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <Input
                      type="number"
                      value={pair.amount}
                      onChange={(e) => updatePairAmount(pair.id, parseFloat(e.target.value) || 0)}
                      className="flex-1 h-8 text-sm font-mono"
                      min="0"
                    />
                    
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono">
                        {convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2, // Use getCurrencySymbolLocal here
                          maximumFractionDigits: 4
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {pair.toCurrency}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-mono font-semibold">
                        {rate?.toFixed(6) || 'N/A'}
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-1 ${
                      rateInfo.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {rateInfo.changePercent >= 0 ? (
                        <TrendUp className="h-3 w-3" />
                      ) : (
                        <TrendDown className="h-3 w-3" />
                      )}
                      <span className="font-semibold">
                        {rateInfo.changePercent >= 0 ? '+' : ''}{rateInfo.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        
        {/* Add new pair button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs"
          onClick={() => {
            const newPair: ConversionPair = {
              id: Date.now().toString(),
              fromCurrency: 'USD',
              toCurrency: 'EUR',
              amount: 1000,
              isVisible: true
            };
            setConversionPairs(prev => [...prev, newPair]);
          }}
        >
          <Calculator className="h-3 w-3 mr-2" />
          Add Conversion Pair
        </Button>
        
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
          {isAutoRefresh ? 'Auto-refreshing every 30s' : 'Manual refresh mode'}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoConversionWidget;