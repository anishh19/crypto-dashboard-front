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
  const [loadingState, setLoading] = useState(true);
  const [iconStatus, setStatus] = useState("left");

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
    const bar = document.querySelector(".bar");
    const twentyFourHourHigh = selectedCoin.coinData.high_24h;
    const twentyFourHourLow = selectedCoin.coinData.low_24h;
    const currentPrice = selectedCoin.coinData.current_price;
    const priceRange = twentyFourHourHigh - twentyFourHourLow;
    const percentage = ((currentPrice - twentyFourHourLow) / priceRange) * 100;
    setTimeout(() => {
      bar.style.setProperty("--progress", `${percentage}%`);
    }, 500);
  }, [selectedCoin]);

  function handleCoinSelect(rank) {
    setLoading(true);
    axios({
      method: "get",
      url: cmcapiurl,
      params: {
        symbol: `${data[rank - 1].symbol}`,
      },
    }).then((res) => {
      let coin = data[rank - 1].symbol.toUpperCase();
      setCoinData({
        currentCoin: data[rank - 1].symbol,
        coinData: data[rank - 1],
        coinDescription: res.data[coin].description,
      });
      setLoading(false);
    });
  }
  useEffect(() => {
    if (iconStatus === "left") {
      document.getElementById("left").style.visibility = "visible";
    } else {
      document.getElementById("left").style.visibility = "hidden";
    }
  }, [iconStatus]);

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
      <div id="left">
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
      {loadingState ? (
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
              {selectedCoin.coinData.price_change_percentage_24h > 0 ? "+" : ""}
              {selectedCoin.coinData.price_change_percentage_24h?.toFixed(2)}% )
            </span>
          </div>
          <div className="grid-container">
            <div className="grid-item, grid-item-1">
              <div class="progress">
                <div class="bar"></div>
              </div>
              {/* <progress
                value={selectedCoin.coinData.current_price}
                max={selectedCoin.coinData.ath}
              /> */}
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
        </div>
      )}
    </>
  );
}

export default Box;
