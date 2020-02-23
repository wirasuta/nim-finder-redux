module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    themeColor: '#FF5252',
    name: 'NIM Finder',
    workboxPluginMode: 'GenerateSW',
    manifestOptions: {
      background_color: '#FFFFFF'
    },
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: new RegExp('^https://nim.wirasuta.com/api/jurusan'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'nama-jurusan',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: new RegExp('^https://nim.wirasuta.com/api/nim'),
          handler: 'NetworkFirst',
          options: {
            networkTimeoutSeconds: 20,
            cacheName: 'search-result',
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
