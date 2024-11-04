module.exports = {
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  jsxSingleQuote: false,
  singleQuote: true,
  endOfLine: 'lf',
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  importOrder: ['^@/(.*)$', '^components/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
