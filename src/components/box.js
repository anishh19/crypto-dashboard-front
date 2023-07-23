import React, { useState, useEffect } from "react";
import axios from "axios";

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc";

function Box() {
  const cmcapiurl = process.env.REACT_APP_CMC_API;
  const [data, setData] = useState([]);
  const [selectedCoin, setCoinData] = useState({
    currentCoin: "",
    coinDescription: "",
    coinData: {},
  });
  const [state, setState] = useState("initial");
  const [iconStatus, setStatus] = useState("left");
  const [rangePercentage, setPercentage] = useState(0);

  useEffect(() => {
    axios.get(`${url}`).then((res) => {
      const stats = res.data.slice(0, 50);
      setData(stats);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      handleCoinSelect(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    setPercentage(0);
    const twentyFourHourHigh = selectedCoin.coinData.high_24h;
    const twentyFourHourLow = selectedCoin.coinData.low_24h;
    const currentPrice = selectedCoin.coinData.current_price;
    const priceRange = twentyFourHourHigh - twentyFourHourLow;
    const percentage = ((currentPrice - twentyFourHourLow) / priceRange) * 100;
    setTimeout(() => {
      setPercentage(percentage);
    }, 500);
  }, [selectedCoin]);

  function handleCoinSelect(rank) {
    setState("loading");
    axios({
      method: "get",
      url: cmcapiurl,
      params: {
        symbol: `${data[rank - 1].symbol}`,
      },
    })
      .then((res) => {
        let coin = data[rank - 1].symbol.toUpperCase();
        setCoinData({
          currentCoin: data[rank - 1].symbol,
          coinData: data[rank - 1],
          coinDescription: res.data[coin].description,
        });
        setState("success");
      })
      .catch((err) => {
        setState("error");
      });
  }

  return (
    <>
      <img
        id="explore"
        onClick={() => {
          if (iconStatus === "left") setStatus("right");
          else setStatus("left");
        }}
        src={
          iconStatus === "right"
            ? `/angle-circle-right.svg`
            : "/angle-circle-left.svg"
        }
        alt="open-side-pane"
      />
      <div
        id="left"
        style={{
          visibility: iconStatus === "left" ? "visible" : "hidden",
        }}
      >
        <h2 className="fixedElement"> Top 50 Cryptos </h2>
        {data?.map((each) => (
          <div
            onClick={() => {
              handleCoinSelect(each.market_cap_rank);
            }}
            key={each.market_cap_rank}
            className="tile"
          >
            <div id="rank"> #{each.market_cap_rank}</div>
            <div id="symbol">
              <img id="coinLogo" src={each.image} alt="logo"></img>
            </div>
            <div id="cryptoName"> {each.name}</div>
            <div id="cryptoPrice"> ${each.current_price}</div>
          </div>
        ))}
      </div>
      {state === "loading" ? (
        <div id="centre">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div id="centre">
          {state === "success" ? (
            <>
              <div>
                <h1> {selectedCoin.currentCoin.toUpperCase()}</h1>
                <img
                  id="centreLogo"
                  src={selectedCoin.coinData.image}
                  alt="logo"
                ></img>
              </div>
              <div> {selectedCoin.coinDescription}</div>
              <div>
                <h3 style={{ display: "inline-block" }}>
                  {selectedCoin.coinData.name} Price : $
                  {selectedCoin.coinData.current_price}
                </h3>
                <span>
                  (
                  {selectedCoin.coinData.price_change_percentage_24h > 0
                    ? "+"
                    : ""}
                  {selectedCoin.coinData.price_change_percentage_24h?.toFixed(
                    2
                  )}
                  % )
                </span>
              </div>
              <div className="grid-container">
                <div className="grid-item, grid-item-1">
                  <div class="progress">
                    <div
                      class="bar"
                      style={{
                        width: `${rangePercentage}%`,
                        borderRadius:
                          rangePercentage > 100 ? "8px" : "8px 0 0 8px",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid-item, grid-item-2">
                  ${selectedCoin.coinData.low_24h}
                </div>
                <div className="grid-item, grid-item-3"> 24 Hour Range</div>
                <div className="grid-item, grid-item-4">
                  ${selectedCoin.coinData.high_24h}
                </div>
              </div>
              <h3> All Time High: ${selectedCoin.coinData.ath} </h3>
            </>
          ) : (
            <h1>Error loading data</h1>
          )}
        </div>
      )}
    </>
  );
}

export default Box;
