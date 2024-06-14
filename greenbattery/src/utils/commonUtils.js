/* eslint-disable no-bitwise */
import * as d3 from "d3";
import moment from "moment";
import { DateTime, Interval } from "luxon";
// import data from "../data/sample_data.json";
// import data2 from "../data/sample_freq.json";

export const formatTooltip = (val, chartType) => {
  switch (chartType) {
    case "price":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val);
    case "freq":
      return `${val} Hz`;
    default:
      return `Hello world`;
  }
};

export const formatPercent = (percent = 0) => {
  let result = "0.00%";
  const isNumber = typeof percent === "number";
  const isString = typeof percent === "string";
  const isNotNaN = !Number.isNaN(parseFloat(percent));

  if ((isNumber || isString) && isNotNaN) {
    result = `${parseFloat(percent) > 0 ? "+" : ""}${d3.format(".2%")(
      percent / 100
    )}`;
  }
  return result;
};

export const getPeriod = (date) => {
  if (!date) return 6;
  const now = DateTime.utc();
  const before = DateTime.fromJSDate(date);
  const i = Interval.fromDateTimes(before, now);
  return i.length("months");
};

export const getXTicks = (months) => {
  if (months <= 2) return d3.timeDay.every(5).filter((d) => d.getDate() !== 31);
  if (months <= 6) return d3.timeMonth.every(1);
  if (months <= 13) return d3.timeMonth.every(2);
  return d3.timeYear.every(1);
};

export const getXTickFormat = (months) => {
  if (months <= 2) return d3.timeFormat("%d %b");
  if (months <= 6) return d3.timeFormat("%b");
  if (months <= 13) return d3.timeFormat("%b %Y");
  return d3.timeFormat("%Y");
};

export const fetchPrice = async (interval) => {
  let endTime = new Date("2024-04-13 20:40:00"); // Change to get current date in production
  let MS_PER_MINUTE = 60000;
  let MS_PER_HOUR = 3600000;
  interval = parseInt(interval);
  if (interval < 5) interval = interval * MS_PER_HOUR;
  else interval = interval * MS_PER_MINUTE;
  let startTime = new Date(endTime - interval);
  let strEndTime = moment(endTime).format("YYYY-MM-DD k:mm:ss");
  let strStartTime = moment(startTime).format("YYYY-MM-DD k:mm:ss");
  let baseUrl =
    "https://szm7509e7i.execute-api.ap-southeast-2.amazonaws.com/Prod/data";
  let requestUrl = `${baseUrl}?startTime=${strStartTime}&endTime=${strEndTime}`;
  console.log(requestUrl);
  let result = await fetch(requestUrl);
  let response = await result.json();

  // let response = data;
  const electricData = {
    name: "Predicted Frequency",
    color: "red",
    items: response.map((e) => ({
      value: e.freq,
      date: new Date(e.timestamp),
    })),
  };
  const fcasData = {
    name: "FCAS Frequency",
    color: "#5e4fa2",
    items: response.map((e) => ({ value: 49, date: new Date(e.timestamp) })),
  };
  const realFrequency = {
    name: "Actual Frequency",
    color: "#4fd1c5",
    items: response.map((e) => ({
      value: e.actualFreq,
      date: new Date(e.timestamp),
    })),
  };
  return [electricData, fcasData, realFrequency];
};

export const fetchFrequency = async (interval) => {
  let endTime = new Date("2023-11-06 20:30:00"); // Change to get current date in production
  let MS_PER_MINUTE = 60000;
  interval = parseInt(interval) * MS_PER_MINUTE; // Change from minutes to seconds
  let startTime = new Date(endTime - interval);
  let strEndTime = moment(endTime).format("YYYY-MM-DD k:mm:ss");
  let strStartTime = moment(startTime).format("YYYY-MM-DD k:mm:ss");
  let baseUrl =
    "https://szm7509e7i.execute-api.ap-southeast-2.amazonaws.com/Prod/data";
  let requestUrl = `${baseUrl}?startTime=${strStartTime}&endTime=${strEndTime}`;
  let result = await fetch(requestUrl);
  let response = await result.json();

  // let response = data2;
  const freqData = {
    name: "Electric Frequency",
    color: "green",
    items: response.map((e) => ({
      value: e.freq,
      date: new Date(e.timestamp),
    })),
  };
  return [freqData];
};
