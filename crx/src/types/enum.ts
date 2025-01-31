export enum CONSTs {
	REFRESH_INTERVAL = 30,
	REFRESH_INTERVAL_UNIT = 'minutes',
	API = import.meta.env.VITE_BACKEND_URL,
	DEV_API = import.meta.env.VITE_DEV_BACKEND_URL,
	JSWOKEN = import.meta.env.VITE_JSWOKEN,
	FRONTEND = import.meta.env.MODE === 'development' ? import.meta.env.VITE_DEV_FRONTEND_URL : import.meta.env.VITE_FRONTEND_URL,
	CRYPTO = import.meta.env.VITE_CRYPTO,

	
}

export enum SyncSource {
	MANUALLY = 'MANUALLY',
	BY_POP_UP = 'BY_POP_UP',
	BY_TIMER = 'BY_TIMER',
	BY_BROWSER_OPEN = 'BY_BROWSER_OPEN',
	ON_INSTALL = "ON_INSTALL"
}
