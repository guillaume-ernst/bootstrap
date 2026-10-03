const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

export default context => ({
  map: context.file.dirname.includes('examples') ? false : mapConfig,
  plugins: {
    autoprefixer: {
      cascade: false
    },
    rtlcss: context.env === 'RTL'
  }
})
