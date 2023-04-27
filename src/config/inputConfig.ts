type inputData = {
  nftAddress: string;
  tokenId: string;
  listingPrice: string;
  listingDuration: string;
  updatePrice: string;
  updateDuration: string;
};

export const inputConfig: Record<number, inputData> = {
  42: {
    nftAddress:
      process.env.LISTING_NFT_ADDRESS ||
      "0xd9e9e6cdd6f406f50a397661698c83fb6650bb4c",
    tokenId: process.env.LISTING_TOKEN_ID || "4",
    listingPrice: "5",
    listingDuration: "30",
    updatePrice: "110",
    updateDuration: "130",
  },
};
