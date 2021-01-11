const fs = require("fs");
const jsdom = require("jsdom");
const axios = require("axios");
const { JSDOM } = jsdom;

async function getHTML() {
  console.log("hi");
  const response = await axios.get(
    "https://www.improbable.com/ig-about/winners/"
  );
  console.log(Object.keys(response));
  const dom = new JSDOM(response.data);
  const strongs = dom.window.document.querySelectorAll("p > strong");
  console.log(Array.from(strongs));
  const prizeTexts = Array.from(strongs).map((element) => {
    if (element.innerHTML.includes("PRIZE")) {
      return element.innerHTML;
    } else {
      return element.innerHTML + " PRIZE";
    }
  });

  prizeTexts.sort();
  const uniquePrizeTexts = new Set(prizeTexts);
  console.log(uniquePrizeTexts);
  const output = Array.from(uniquePrizeTexts);
  fs.writeFileSync("./prizeCategories.json", JSON.stringify(output));
}
getHTML();
