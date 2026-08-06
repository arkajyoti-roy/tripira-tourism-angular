export const environment = {
  production: false,
  get _base() {
    let raw = import.meta.env['NG_APP_BACKEND_URL'] || (typeof window !== 'undefined' ? window.location.origin : '');
    
    // Strip trailing /api/public or /api if the old env variable is still cached in memory
    raw = raw.replace(/\/api\/public\/?$/, '').replace(/\/api\/?$/, '');
    return raw;
  },

  
  get apiUrl() {
    return this._base ? `${this._base}/api/public` : '/api/public';
  },
  get adminApiUrl() {
    return this._base ? `${this._base}/api` : '/api';
  },
  get baseUrl() {
    return this._base;
  },
  get igAccessToken() {
    return import.meta.env['NG_APP_IG_ACCESS_TOKEN'] || import.meta.env['IG_ACCESS_TOKEN'] || '';
  },
  get igAppId() {
    return import.meta.env['NG_APP_IG_APP_ID'] || import.meta.env['IG_APP_ID'] || '';
  },
  get igAppSecret() {
    return import.meta.env['NG_APP_IG_APP_SECRET'] || import.meta.env['IG_APP_SECRET'] || '';
  }
};
