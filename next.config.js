
module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/news/:slug*',
          destination: '/edits/:slug*',
        },
      ],
    };
  },
  
    images: {
      remotePatterns: [
        {
          hostname: 'cdn.sanity.io'
        },
        {
          hostname: 'musicforpennies.se',
        },
        {
          hostname: 'images.ctfassets.net',
        },
        {
          hostname: 'images.unsplash.com',
        }
      ],
    },
  }