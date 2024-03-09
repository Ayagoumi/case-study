const BNtoDay = (bn: BigInt | undefined) => {
  if (!bn) return 0;

  const BNDay = 60 * 60 * 24;

  return Number(bn) / BNDay;
};

export { BNtoDay };
