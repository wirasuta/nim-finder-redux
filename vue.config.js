module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    themeColor: '#FF5252',
    name: 'NIM Finder',
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://nim.wirasuta.com/api/'),
          handler: 'networkFirst',
          options: {
            networkTimeoutSeconds: 20,
            cacheName: 'api',
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 90
            }
          }
        }
      ]
    }
  }
}
