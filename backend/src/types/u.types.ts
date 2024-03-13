export interface RequestIP {
	ip: string;
	hostname: string;
	city: string;
	region: string;
	country: string;
	loc: string;
	org: string;
	timezone: string;
	countryCode: string;
	countryFlag: CountryFlag;
	countryFlagURL: string;
	countryCurrency: CountryCurrency;
	continent: Continent;
	isEU: boolean;
}
export interface ICookie {
	name: string;
	value: string;
	domain: string;
	path: string;
	expires: number;
	size: number;
	httpOnly: boolean;
	secure: boolean;
	session: boolean;
	sameSite: string;
}
interface CountryFlag {
	emoji: string;
	unicode: string;
}

interface CountryCurrency {
	code: string;
	symbol: string;
}
interface Continent {
	code: string;
	name: string;
}
