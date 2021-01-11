const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const axios = require("axios");

const REGEX_YEAR = /[0-9]{4}/;
// Meant to match years: e.g. 2020 1991
const REGEX_COUNTRY_ARRAY = /(\[)([A-Z ,]+)(\])/g;
// Meant to match an array like format for countries: [USA, INDIA, ITALY]
const REGEX_PEOPLE_NAMES = /[A-Z][a-z]+ ([A-Za-z.]+)? ?[A-Z][a-z]+/g;
// Meant to match 2 or words starting with 1 uppercase letter and possibly some characters in between
// These are often names, E.g. Joseph Keller, Erich von Daniken, Robert Klark Graham, Robert H. Beaumont
const REGEX_REASON = /(, for)(.+)/g;
// the format of the paragraph tends to be: type of prize, countries, names, for ... reason
// the ", for" gives the entire reason in most cases
const REGEX_REASON_EDGE_CASES = /(for)(.+)/g;
// In some cases there is a different format, so after checking ", for" we can look for any sentence starting with for

async function getFirstPrize() {
  const response = await axios.get(
    "https://www.improbable.com/ig-about/winners/"
  );
  const dom = new JSDOM(response.data);
  const contentOfInterest = dom.window.document.querySelectorAll(
    "h2, p > strong, p > b"
  );

  let latestYear = null;
  const years = [];
  const prizes = [];

  // There are no divs grouping the content per year
  // So in order to determine which price is from what year
  // we process them in order. The year is always in a H2 tag
  // followed by one ore more p tags with the details of the prizes
  for (element of contentOfInterest) {
    if (element.tagName === "H2") {
      const [year] = element.textContent.match(REGEX_YEAR) ?? [];
      if (year) {
        latestYear = year;
        years.push(year);
      }
    } else {
      const prize = parsePrize(element.parentElement, latestYear);
      if (prize) {
        prizes.push(prize);
      }
    }
  }

  fs.writeFileSync("prizes.json", JSON.stringify(prizes));
}
getFirstPrize();

function parsePrize(prize, year) {
  const type = parsePrizeType(prize);
  const winners = parseNames(prize);
  const countries = parseCountries(prize);
  const reason = parseReason(prize);
  const resources = parseResources(prize);

  if (type && reason) {
    return { type, year, reason, countries, winners, resources };
  } else {
    return null;
  }
}

function parsePrizeType(prize) {
  const boldText = prize.querySelector("b, strong").textContent;
  if (boldText.includes("PRIZE")) {
    const STRIP_LAST_6_CHARACTERS = 6;
    return boldText.substring(0, boldText.length - STRIP_LAST_6_CHARACTERS);
  } else {
    return boldText;
  }
}

function handleNameExceptions(text) {
  switch (true) {
    case text.includes("Volkswagen"):
      return ["Volkswagen"];

    case text.includes("Spam"):
      return [
        "The utilizers of Spam, courageous consumers of canned comestibles",
      ];
    default:
      console.log("ERROR: NO NAMES COULD BE PARSED:", text);
      return [];
  }
}

function parseNames(prize) {
  // the format of the paragraph tends to be: type of prize, countries, names, for ... reason
  // so we matching for names in the string beofre the reason has the highest accuracy
  const forpart = prize.textContent.split("for ")[0];
  const matches = forpart.match(REGEX_PEOPLE_NAMES);
  if (matches) {
    return matches;
  } else {
    return handleNameExceptions(prize.textContent);
  }
}

function parseResources(prize) {
  return Array.from(prize.querySelectorAll("a")).map((link) => ({
    name: link.textContent,
    url: link.href,
  }));
}

function parseCountries(prize) {
  const countries = prize.textContent.match(REGEX_COUNTRY_ARRAY);
  if (countries) {
    const countryString = countries[0];
    return countryString.substring(1, countryString.length - 1).split(", ");
  } else {
    // console.log("ERROR: NO COUNTRIES COULD BE PARSED", prize.textContent);
    return null;
  }
}

function handleReasonExceptions(text) {
  switch (true) {
    case text.includes("SPECIAL ANNOUNCEMENT"):
      // this special announcement is retroactively included in the data, safe to ignore
      return null;

    case text.includes("titan of Wall Street"):
      // a reason format unlike any other (pretty funny though!)
      return "Father of the junk bond, to whom the world is indebted.";

    default:
      console.log("ERROR: NO REASON COULD BE PARSED", text);
      return null;
  }
}

function parseReason(prize) {
  // checking for the pattern: ", for" (most common)
  const reason = prize.textContent.match(REGEX_REASON);
  if (reason) {
    // stripping ", for "
    const STRIP_FIRST_6_CHARACTERS = 6;
    const reasonStripped = reason[0].substring(STRIP_FIRST_6_CHARACTERS);

    return capitalizeSentence(reasonStripped);
  } else {
    // checking for the pattern: "for " (backup plan)
    const reason = prize.textContent.match(REGEX_REASON_EDGE_CASES);
    if (reason) {
      // stripping "for "
      const STRIP_FIRST_4_CHARACTERS = 4;
      const reasonStripped = reason[0].substring(STRIP_FIRST_4_CHARACTERS);
      return capitalizeSentence(reasonStripped);
    } else {
      const reasonStripped = handleReasonExceptions(prize.textContent);

      if (reasonStripped) {
        return capitalizeSentence(reasonStripped);
      } else {
        return null;
      }
    }
  }
}
function capitalizeSentence(reasonStripped) {
  return reasonStripped.charAt(0).toUpperCase() + reasonStripped.slice(1);
}
