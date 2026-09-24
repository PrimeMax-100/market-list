export interface CountryCurrency {
  country: string;
  flag: string;
  code: string; // ISO 4217 currency code
  currencyName: string;
}

export const DEFAULT_CURRENCY = "NGN";

// Country → currency list used by the currency switcher (sorted alphabetically at render).
export const COUNTRY_CURRENCIES: CountryCurrency[] = [
  { country: "Argentina", flag: "🇦🇷", code: "ARS", currencyName: "Argentine Peso" },
  { country: "Australia", flag: "🇦🇺", code: "AUD", currencyName: "Australian Dollar" },
  { country: "Austria", flag: "🇦🇹", code: "EUR", currencyName: "Euro" },
  { country: "Bangladesh", flag: "🇧🇩", code: "BDT", currencyName: "Bangladeshi Taka" },
  { country: "Belgium", flag: "🇧🇪", code: "EUR", currencyName: "Euro" },
  { country: "Benin", flag: "🇧🇯", code: "XOF", currencyName: "West African CFA Franc" },
  { country: "Brazil", flag: "🇧🇷", code: "BRL", currencyName: "Brazilian Real" },
  { country: "Cameroon", flag: "🇨🇲", code: "XAF", currencyName: "Central African CFA Franc" },
  { country: "Canada", flag: "🇨🇦", code: "CAD", currencyName: "Canadian Dollar" },
  { country: "Chile", flag: "🇨🇱", code: "CLP", currencyName: "Chilean Peso" },
  { country: "China", flag: "🇨🇳", code: "CNY", currencyName: "Chinese Yuan" },
  { country: "Colombia", flag: "🇨🇴", code: "COP", currencyName: "Colombian Peso" },
  { country: "Czechia", flag: "🇨🇿", code: "CZK", currencyName: "Czech Koruna" },
  { country: "Denmark", flag: "🇩🇰", code: "DKK", currencyName: "Danish Krone" },
  { country: "Egypt", flag: "🇪🇬", code: "EGP", currencyName: "Egyptian Pound" },
  { country: "Ethiopia", flag: "🇪🇹", code: "ETB", currencyName: "Ethiopian Birr" },
  { country: "Finland", flag: "🇫🇮", code: "EUR", currencyName: "Euro" },
  { country: "France", flag: "🇫🇷", code: "EUR", currencyName: "Euro" },
  { country: "Germany", flag: "🇩🇪", code: "EUR", currencyName: "Euro" },
  { country: "Ghana", flag: "🇬🇭", code: "GHS", currencyName: "Ghanaian Cedi" },
  { country: "Hong Kong", flag: "🇭🇰", code: "HKD", currencyName: "Hong Kong Dollar" },
  { country: "Hungary", flag: "🇭🇺", code: "HUF", currencyName: "Hungarian Forint" },
  { country: "India", flag: "🇮🇳", code: "INR", currencyName: "Indian Rupee" },
  { country: "Indonesia", flag: "🇮🇩", code: "IDR", currencyName: "Indonesian Rupiah" },
  { country: "Ireland", flag: "🇮🇪", code: "EUR", currencyName: "Euro" },
  { country: "Israel", flag: "🇮🇱", code: "ILS", currencyName: "Israeli New Shekel" },
  { country: "Italy", flag: "🇮🇹", code: "EUR", currencyName: "Euro" },
  { country: "Japan", flag: "🇯🇵", code: "JPY", currencyName: "Japanese Yen" },
  { country: "Jordan", flag: "🇯🇴", code: "JOD", currencyName: "Jordanian Dinar" },
  { country: "Kenya", flag: "🇰🇪", code: "KES", currencyName: "Kenyan Shilling" },
  { country: "Kuwait", flag: "🇰🇼", code: "KWD", currencyName: "Kuwaiti Dinar" },
  { country: "Malaysia", flag: "🇲🇾", code: "MYR", currencyName: "Malaysian Ringgit" },
  { country: "Mexico", flag: "🇲🇽", code: "MXN", currencyName: "Mexican Peso" },
  { country: "Morocco", flag: "🇲🇦", code: "MAD", currencyName: "Moroccan Dirham" },
  { country: "Netherlands", flag: "🇳🇱", code: "EUR", currencyName: "Euro" },
  { country: "New Zealand", flag: "🇳🇿", code: "NZD", currencyName: "New Zealand Dollar" },
  { country: "Nigeria", flag: "🇳🇬", code: "NGN", currencyName: "Nigerian Naira" },
  { country: "Norway", flag: "🇳🇴", code: "NOK", currencyName: "Norwegian Krone" },
  { country: "Pakistan", flag: "🇵🇰", code: "PKR", currencyName: "Pakistani Rupee" },
  { country: "Peru", flag: "🇵🇪", code: "PEN", currencyName: "Peruvian Sol" },
  { country: "Philippines", flag: "🇵🇭", code: "PHP", currencyName: "Philippine Peso" },
  { country: "Poland", flag: "🇵🇱", code: "PLN", currencyName: "Polish Zloty" },
  { country: "Portugal", flag: "🇵🇹", code: "EUR", currencyName: "Euro" },
  { country: "Qatar", flag: "🇶🇦", code: "QAR", currencyName: "Qatari Riyal" },
  { country: "Romania", flag: "🇷🇴", code: "RON", currencyName: "Romanian Leu" },
  { country: "Rwanda", flag: "🇷🇼", code: "RWF", currencyName: "Rwandan Franc" },
  { country: "Saudi Arabia", flag: "🇸🇦", code: "SAR", currencyName: "Saudi Riyal" },
  { country: "Senegal", flag: "🇸🇳", code: "XOF", currencyName: "West African CFA Franc" },
  { country: "Singapore", flag: "🇸🇬", code: "SGD", currencyName: "Singapore Dollar" },
  { country: "South Africa", flag: "🇿🇦", code: "ZAR", currencyName: "South African Rand" },
  { country: "South Korea", flag: "🇰🇷", code: "KRW", currencyName: "South Korean Won" },
  { country: "Spain", flag: "🇪🇸", code: "EUR", currencyName: "Euro" },
  { country: "Sweden", flag: "🇸🇪", code: "SEK", currencyName: "Swedish Krona" },
  { country: "Switzerland", flag: "🇨🇭", code: "CHF", currencyName: "Swiss Franc" },
  { country: "Tanzania", flag: "🇹🇿", code: "TZS", currencyName: "Tanzanian Shilling" },
  { country: "Thailand", flag: "🇹🇭", code: "THB", currencyName: "Thai Baht" },
  { country: "Tunisia", flag: "🇹🇳", code: "TND", currencyName: "Tunisian Dinar" },
  { country: "Turkey", flag: "🇹🇷", code: "TRY", currencyName: "Turkish Lira" },
  { country: "Uganda", flag: "🇺🇬", code: "UGX", currencyName: "Ugandan Shilling" },
  { country: "United Arab Emirates", flag: "🇦🇪", code: "AED", currencyName: "UAE Dirham" },
  { country: "United Kingdom", flag: "🇬🇧", code: "GBP", currencyName: "British Pound" },
  { country: "United States", flag: "🇺🇸", code: "USD", currencyName: "US Dollar" },
  { country: "Vietnam", flag: "🇻🇳", code: "VND", currencyName: "Vietnamese Dong" },
  { country: "Zambia", flag: "🇿🇲", code: "ZMW", currencyName: "Zambian Kwacha" },
];

export function findCountryByCurrency(code: string): CountryCurrency | undefined {
  return COUNTRY_CURRENCIES.find((c) => c.code === code);
}
