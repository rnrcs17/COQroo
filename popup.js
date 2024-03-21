let totalTokens = document.getElementById("total-token");
let marketCapRank = document.getElementById("market-cap-rank");
let marketCapValue = document.getElementById("market-cap-value");
let currentPriceValue = document.getElementById("current-price-value");
let volume24h = document.getElementById("24h-volume");
let dayHighLowValue = document.getElementById("24h-high-low-value");
let allTimeHighValue = document.getElementById("alltime-high-value");
let allTimeLowValue = document.getElementById("alltime-low-value");

let userCoqCount = document.getElementById("user-coq-count");
let userCoqAvgCost = document.getElementById("user-avg-cost");
let userCoqCost = document.getElementById("user-coq-cost");
let userCoqWorth = document.getElementById("user-coq-worth");
let userAthWorth = document.getElementById("user-ath-worth");

let lastUpdated = document.getElementById("last-updated");

let currentCoqPrice;
let athCoqPrice;

let userCOQ = localStorage.getItem("userCOQ");
let userAvgCost = localStorage.getItem("userAvgCost");

if (userCOQ) {
  userCoqCount.value = userCOQ;
}
if (userAvgCost) {
  userCoqAvgCost.value = userAvgCost;
}

fetch("https://api.coingecko.com/api/v3/coins/coq-inu/contract/0x420fca0121dc28039145009570975747295f2329")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // console.log(data);
    let md = data["market_data"];
    let mcv = md["market_cap"]["usd"];

    totalTokens.innerHTML = `${md["circulating_supply"]} <b>(${formatNumber(
      md["circulating_supply"]
    )}) <span class="secondary-color"> 🐓 Total COQs</span></b>`;
    marketCapRank.innerHTML = `#${data["market_cap_rank"]}`;
    marketCapValue.innerHTML = `<b>$${formatNumber(mcv)} USD</b> (${(md["market_cap_change_percentage_24h"]).toFixed(2)}% 24h)`;
    currentCoqPrice = md["current_price"]["usd"];
    athCoqPrice = md["ath"]["usd"];
    currentPriceValue.innerHTML = `<b>$${currentCoqPrice} USD </b>(${(md["price_change_percentage_24h"]).toFixed(2)}% 24h)`;
    volume24h.innerHTML = `$${formatNumber(md["total_volume"]["usd"])} USD`;
    dayHighLowValue.innerHTML = `$${md["high_24h"]["usd"]}/${md["low_24h"]["usd"]} USD`;
    allTimeHighValue.innerHTML = `$${athCoqPrice} USD`;
    allTimeLowValue.innerHTML = `$${md["atl"]["usd"]} USD`;

    if (userAvgCost) {
      userCoqCost.innerHTML = `$${(userCOQ * userAvgCost).toFixed(2)} USD`;
    }
    let diff =
      ((userCOQ * currentCoqPrice - userCOQ * userAvgCost) /
        (userCOQ * userAvgCost)) *
      100;
    if (userCOQ) {
      userCoqWorth.innerHTML = `<b>$${(userCOQ * currentCoqPrice).toFixed(
        2
      )} USD</b> &nbsp; (${diff.toFixed(2) > 0 ? '+' + diff.toFixed(2) : diff.toFixed(2)}%)`;
      userAthWorth.innerHTML = `$${(userCOQ * athCoqPrice).toFixed(2)} USD`;
    }
    // lastUpdated.innerHTML = `Last updated: ${convertTimestampToReadable(md["last_updated"])}`;
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

const feedbackButton = document.getElementById("feedback-button");
feedbackButton.addEventListener("click", () => {
  window.open("https://forms.gle/M52vDZqaaehdbGfg9", "_blank").focus();
});

const marketStatsButton = document.getElementById("market-stats-button");
const userStatsButton = document.getElementById("user-stats-button");
const marketStatsSection = document.getElementById("market-stats");
const userStatsSection = document.getElementById("user-stats");
const memeSection = document.getElementById("meme-section");
// memeSection.innerHTML = getMemeMessage(userCOQ);

userCoqCount.addEventListener("input", valueChange);

userCoqAvgCost.addEventListener("input", valueChange);

function valueChange() {
  userAvgCost = userCoqAvgCost.value;
  localStorage.setItem("userAvgCost", userAvgCost);

  userCOQ = userCoqCount.value;
  localStorage.setItem("userCOQ", userCOQ);
  let diff =
    ((userCOQ * currentCoqPrice - userCOQ * userAvgCost) /
      (userCOQ * userAvgCost)) *
    100;

  if (userAvgCost) {
    userCoqCost.innerHTML = `$${(userCOQ * userAvgCost).toFixed(2)} USD`;
    // userAthWorth.innerHTML = `$${(userCOQ * athCoqPrice).toFixed(2)} USD`;
    // memeSection.innerHTML = getMemeMessage(userCOQ);
  }

  if (userCOQ) {
    userCoqWorth.innerHTML = `<b>$${(userCOQ * currentCoqPrice).toFixed(2)} USD</b> &nbsp; (${diff.toFixed(2) > 0 ? '+' + diff.toFixed(2) : diff.toFixed(2)}%)`;
    userAthWorth.innerHTML = `$${(userCOQ * athCoqPrice).toFixed(2)} USD`;
    // memeSection.innerHTML = getMemeMessage(userCOQ);
  }
}

marketStatsButton.style.fontWeight = "bold";
marketStatsButton.style.borderColor = "white";

marketStatsButton.addEventListener("click", () => {
  marketStatsSection.style.display = "";
  userStatsSection.style.display = "none";
  marketStatsButton.style.fontWeight = "bold";
  marketStatsButton.style.borderColor = "white";
  userStatsButton.style.fontWeight = "normal";
  userStatsButton.style.borderColor = "var(--secondary-color)";
});

userStatsButton.addEventListener("click", () => {
  marketStatsSection.style.display = "none";
  userStatsSection.style.display = "";
  userStatsButton.style.fontWeight = "bold";
  userStatsButton.style.borderColor = "white";
  marketStatsButton.style.fontWeight = "normal";
  marketStatsButton.style.borderColor = "var(--secondary-color)";
});

function formatNumber(number) {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(0) + "B";
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + "M";
  } else {
    return number.toString();
  }
}

function getMemeMessage(count) {
  if (count >= 1000000000) {
    return `Wow! You're a COQ billionaire! 🤑💰`;
  } else if (count >= 1000000) {
    return `You're a COQ millionaire! 💰💼`;
  } else {
    return `You're just a tiny little COQ! 🐔😄`;
  }
}

function convertTimestampToReadable(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

