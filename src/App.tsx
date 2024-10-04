import { useEffect, useState } from "react";
import { Button, Display, Input, Text } from "@stellar/design-system";
import { Box } from "@/components/Box";

import anchorLogoSrc from "/anchor-logo.svg";
import assetUsdcIconSrc from "/asset-usdc.svg";
import assetXlmIconSrc from "/asset-xlm.svg";

const ASSET_ICON: { [key: string]: string } = {
  XLM: assetXlmIconSrc,
  USDC: assetUsdcIconSrc,
};

const SEP24_SERVER_URL = "https://anchor-sep-server-m24.stellar.org/sep24";

// https://anchor-sep-server-m24.stellar.org/sep24/transaction?id=bc9e319f-87bb-4a02-8e33-1cb54dcb96a5&lang=en

// https://anchor-reference-server-m24.stellar.org/sep24/interactive?transaction_id=bc9e319f-87bb-4a02-8e33-1cb54dcb96a5&token=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiYzllMzE5Zi04N2JiLTRhMDItOGUzMy0xY2I1NGRjYjk2YTUiLCJleHAiOjE3MjgwMDI5MjQsInN1YiI6IkNBSE01TjRYNlJDRFQ1R1BQNFdCSFdDN0xJSERTMktVTURFNFU2NkxLUFpGM1BGUTJMRFU3RU5IIiwiZGF0YSI6eyJhbW91bnQiOiIxIiwibGFuZyI6ImVuIiwiYXNzZXQiOiJzdGVsbGFyOlVTREM6R0RRT0UyM0NGU1VNU1ZRSzRZNUpIUFBZSzczVllDTkhaSEE3RU5LQ1YzN1A2U1VFTzZYUUJLUFAifX0.vFAD33opHaFtuActzLSbxmzsJ9DuOOlPVEl8Vp1BGgg

// ?transaction_id=96248a6d-9409-44d5-b8ae-9e223a3c684f&token=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5NjI0OGE2ZC05NDA5LTQ0ZDUtYjhhZS05ZTIyM2EzYzY4NGYiLCJleHAiOjE3Mjc5OTk1MjAsInN1YiI6IkNBSE01TjRYNlJDRFQ1R1BQNFdCSFdDN0xJSERTMktVTURFNFU2NkxLUFpGM1BGUTJMRFU3RU5IIiwiZGF0YSI6eyJhbW91bnQiOiIxIiwibGFuZyI6ImVuIiwiYXNzZXQiOiJzdGVsbGFyOlVTREM6R0RRT0UyM0NGU1VNU1ZRSzRZNUpIUFBZSzczVllDTkhaSEE3RU5LQ1YzN1A2U1VFTzZYUUJLUFAifX0.sWSANzqDf3Ox6jc_4ra0n43ELwojkMxg9WxKKqL6bKU

const truncateStr = (str: string, size: number = 4): string => {
  if (2 * size >= str.length) {
    return str;
  }

  return str.substring(0, size) + "..." + str.substring(str.length - size);
};

function App() {
  const [currentPage, setCurrentPage] = useState<"details" | "confirmation">("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAssetCode = (asset: string) => asset.split(":")[1];

  // TODO: update these
  // transaction.to
  const [txAddress] = useState("CAHM5N4X6RCDT5GPP4WBHWC7LIHDS2KUMDE4U66LKPZF3PFQ2LDU7ENH");
  // .amount_in
  const [amountIn] = useState("1");
  // .amount_out
  const [amountOut] = useState("0.9");
  // .amount_out_asset (stellar:USDC:GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP)
  const [amountOutAsset] = useState(
    getAssetCode("stellar:USDC:GDQOE23CFSUMSVQK4Y5JHPPYK73VYCNHZHA7ENKCV37P6SUEO6XQBKPP"),
  );

  useEffect(() => {
    console.log(">>> window.location.search: ", window.location.search);

    const searchParams = new URLSearchParams(window.location.search);

    const transactionId = searchParams.get("transaction_id");
    const token = searchParams.get("token");

    console.log(">>> transactionId: ", transactionId);
    console.log(">>> token: ", token);

    if (!(transactionId && token)) {
      return;
    }

    try {
      const fetchTx = async () => {
        const response = await fetch(`${SEP24_SERVER_URL}/transaction?id=${transactionId}&lang=en`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        return await response.json();
      };

      fetchTx().then((res) => {
        console.log(">>> res: ", res);
      });
    } catch (e) {
      console.log(">>> Failed to fetch transaction data: ", e);
    }
  }, []);

  const renderContent = () => {
    if (currentPage === "details") {
      return (
        <>
          <Box gap="md" align="center">
            <Text size="sm" as="div" addlClassName="App__message">
              Confirm your KYC details to complete your cash-in deposit
            </Text>
          </Box>

          <Box gap="lg">
            <Input
              id="first-name"
              label="First Name"
              fieldSize="md"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />
            <Input
              id="last-name"
              label="Last Name"
              fieldSize="md"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                setIsLoading(true);

                const t = setTimeout(() => {
                  setCurrentPage("confirmation");
                  setIsLoading(false);
                  clearTimeout(t);
                }, 2000);
              }}
              isLoading={isLoading}
              disabled={!(firstName && lastName)}
            >
              Continue
            </Button>
          </Box>
        </>
      );
    }

    return (
      <>
        <Box gap="md" align="center">
          <Text size="sm" as="div" addlClassName="App__message">
            {`Bank transfer was successfully received, sending the above amount to your wallet ${truncateStr(
              txAddress,
            )}`}
          </Text>
        </Box>

        <Box gap="lg" justify="end" addlClassName="App__footer">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => {
              window.close();
            }}
          >
            Done
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Box gap="xl" addlClassName="App">
      <Box gap="lg" align="center" addlClassName="App__header">
        <img src={anchorLogoSrc} alt="Anchor LLC logo" />

        <Box gap="xs" align="center">
          <Display as="div" size="xs" weight="medium">
            Anchor LLC
          </Display>

          <Text size="sm" as="div">
            {`${truncateStr(txAddress)}`}
          </Text>
        </Box>
      </Box>

      <Box gap="md" align="center">
        <Display as="div" size="sm" weight="medium">
          {`${Number(amountIn).toFixed(2)} USD`}
        </Display>

        <div className="Badge Badge--tertiary Badge--md">
          {ASSET_ICON[amountOutAsset] ? <img src={ASSET_ICON[amountOutAsset]} alt="asset icon" /> : null}
          {`Receiving ${Number(amountOut).toFixed(2)} ${amountOutAsset}`}
        </div>
      </Box>

      {renderContent()}
    </Box>
  );
}

export default App;
