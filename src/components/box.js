
import React ,{useState, useEffect} from "react";
import axios from "axios";



const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc";


function Box(){
        const [data,setData] = useState();
        const [selectedCoin,setCoinData] = useState({currentCoin: "", coinDescription: "", coinData:{}});
        useEffect(()=>{ 
                axios.get(`${url}`).then(res => {
                const stats = res.data.slice(0,50);
                setData(stats);
                setCoinData({...selectedCoin,currentCoin : "btc",coinData : stats[0]});
                });
                }   
            ,[]);

        useEffect(()=> {axios({ 
            method: "get",
            url: `https://coinmarketcapapibyanish.herokuapp.com/testAPI`,
            params: {
                'symbol': `${selectedCoin.currentCoin}`
            },
            }).then(res=> 
                
                {
                document.getElementById("centre").style.visibility = "hidden";  
                let coin = selectedCoin.currentCoin.toUpperCase();
                setCoinData({...selectedCoin, coinDescription : res.data[coin].description});
                document.getElementById("centre").style.visibility = "";  
                console.log("unhide") ;
            });  }
        ,[selectedCoin.currentCoin]);

        
        
function clickMe(e) { 
            document.getElementById("centre").style.visibility = "hidden";  
            console.log("hide") ;
            let target = e.currentTarget;
            console.log(data);
            let id = target.querySelector('#rank');
            let rank=id.textContent.split("#")[1];
            setCoinData({...selectedCoin, currentCoin : data[rank-1].symbol, coinData : data[rank-1]});
};  
        

    return <>
        <div id="left">
            <h2 className="fixedElement"> Top 50 Cryptos</h2>
            {data?.map((each)=> 
            <div onClick={clickMe} key={each.market_cap_rank} className="tile">
            <div id="rank"> #{each.market_cap_rank}</div>
            <div id= "symbol">
            <img height="40px" width="40px" src={each.image} alt="logo"></img>
            </div>
            <div id= "cryptoName"> {each.name}</div>
            <div id= "cryptoPrice"> ${each.current_price}</div>
            </div>)}
        </div>
            
        <div id="centre">
            <div>
            <img style= {{display:"inline-block"}} height="50px" width="50px" src={selectedCoin.coinData.image} alt="logo"></img>
            <h2 style= {{display:"inline-block"}}> {selectedCoin.currentCoin.toUpperCase()}</h2>
            </div>

            <div> {selectedCoin.coinDescription}</div>
            <br></br>
            <div> 
                <h3 style= {{display:"inline-block"}}> {selectedCoin.coinData.name} Price : ${selectedCoin.coinData.current_price}</h3>
                <span>
                    ({selectedCoin.coinData.price_change_percentage_24h>0 ? "+" : ""}
                    {selectedCoin.coinData.price_change_percentage_24h?.toFixed(2)}% )
                </span>
            </div>
            <div className="grid-container">
            <div className="grid-item, grid-item-1">
            <progress  value = {selectedCoin.coinData.current_price} max = {selectedCoin.coinData.ath}/>
            </div>
            <div className="grid-item, grid-item-2">  ${selectedCoin.coinData.low_24h}</div>
            <div className="grid-item, grid-item-3">  24 Hour Range</div>
            <div className="grid-item, grid-item-4">  ${selectedCoin.coinData.high_24h}</div>
            </div>
            <h3> All Time High: ${selectedCoin.coinData.ath} </h3>
            <br></br>
            
            
            
            
                
        </div>
    </>
};

export default Box;