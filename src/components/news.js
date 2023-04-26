import React, { useState, useEffect } from "react";
import axios from "axios";

const url = "https://api.coinstats.app/public/v1/news?skip=0&limit=20";

function News() {
  const [articles, setNews] = useState();

  useEffect(() => {
    axios.get(`${url}`).then((res) => {
      setNews(res.data.news);
    });
  }, []);

  return (
    <div>
      <div id="right">
        <div className="fixedElement"> Top News</div>
        {articles?.map((each) => (
          <div key={each.link} className="newsTile">
            <img id="sourceLogo" src={each.imgURL} alt="logo"></img>
            <a href={each.link}>
              <h3> {each.title}</h3>
            </a>
            <span> SOURCE: {each.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default News;
