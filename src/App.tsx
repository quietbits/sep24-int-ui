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

const REF_SERVER_URL = "https://anchor-reference-server-m24.stellar.org";
// const REF_SERVER_URL = "http://localhost:8091";

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

  const [txAddress, setTxAddress] = useState("");
  const [amountIn, setAmountIn] = useState("0");
  const [amountOut, setAmountOut] = useState("0");
  const [amountOutAsset, setAmountOutAsset] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const transactionId = searchParams.get("transaction_id");

    if (!transactionId) {
      return;
    }

    try {
      const fetchTx = async () => {
        const response = await fetch(`${REF_SERVER_URL}/transaction`, {
          headers: { Authorization: `Bearer ${transactionId}` },
        });

        return await response.json();
      };

      fetchTx().then((res) => {
        if (res.destination_account && res.amount_expected.amount && res.amount_expected.asset) {
          setTxAddress(res.destination_account);
          setAmountIn(res.amount_expected.amount);
          setAmountOut(res.amount_expected.amount);
          setAmountOutAsset(getAssetCode(res.amount_expected.asset));
        }
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
          {txAddress ? (
            <Text size="sm" as="div" addlClassName="App__message">
              {`Bank transfer was successfully received, sending the above amount to your wallet ${truncateStr(
                txAddress,
              )}`}
            </Text>
          ) : null}
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

          <>
            {txAddress ? (
              <Text size="sm" as="div">
                {`${truncateStr(txAddress)}`}
              </Text>
            ) : null}
          </>
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
