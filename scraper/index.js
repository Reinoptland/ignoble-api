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

async function getFirstPrize() {
  const response = await axios.get(
    "https://www.improbable.com/ig-about/winners/"
  );
  const dom = new JSDOM(response.data);
  const strongs = dom.window.document.querySelectorAll("p > strong");

  const firstPrize = strongs[0].parentElement;

  //(\[)([A-Z ,]+)(\])

  // 1. we need strip [ and ] character
  // 2. split on ', ' -> array countries
  const countries = firstPrize.textContent.match(/(\[)([A-Z ,]+)(\])/g)[0];
  var result = countries.substring(1, countries.length - 1).split(", ");
  console.log(result);

  const reason = firstPrize.textContent.match(/(, for)(.+)/g)[0].substring(6);
  const formattedReason = reason.charAt(0).toUpperCase() + reason.slice(1);
  console.log(formattedReason);

  const links = Array.from(firstPrize.querySelectorAll("a"));
  const resources = links.map((link) => {
    return { name: link.textContent, url: link.href };
  });

  fs.writeFileSync(
    "./acoustics-2020.json",
    JSON.stringify({
      countries: result,
      reason: formattedReason,
      resources: resources,
    })
  );
}
getFirstPrize();
