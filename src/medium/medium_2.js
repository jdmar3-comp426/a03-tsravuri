import mpg_data from "./data/mpg_data.js";
import { getStatistics } from "./medium_1.js";

/*
This section can be done by using the array prototype functions.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
see under the methods section
*/


/**
 * This object contains data that has to do with every car in the `mpg_data` object.
 *
 *
 * @param {allCarStats.avgMpg} Average miles per gallon on the highway and in the city. keys `city` and `highway`
 *
 * @param {allCarStats.allYearStats} The result of calling `getStatistics` from medium_1.js on
 * the years the cars were made.
 *
 * @param {allCarStats.ratioHybrids} ratio of cars that are hybrids
 */
export const allCarStats = {
    avgMpg: {
        city: getStatistics(mpg_data.map((a) => a.city_mpg)).mean,
        highway: getStatistics(mpg_data.map((a) => a.highway_mpg)).mean,
    },
    allYearStats: getStatistics(mpg_data.map((a) => a.year)),
    ratioHybrids: mpg_data.filter((a) => a.hybrid).length / mpg_data.length,
};


/**
 * HINT: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
 *
 * @param {moreStats.makerHybrids} Array of objects where keys are the `make` of the car and
 * a list of `hybrids` available (their `id` string). Don't show car makes with 0 hybrids. Sort by the number of hybrids
 * in descending order.
 *
 *[{
 *     "make": "Buick",
 *     "hybrids": [
 *       "2012 Buick Lacrosse Convenience Group",
 *       "2012 Buick Lacrosse Leather Group",
 *       "2012 Buick Lacrosse Premium I Group",
 *       "2012 Buick Lacrosse"
 *     ]
 *   },
 *{
 *     "make": "BMW",
 *     "hybrids": [
 *       "2011 BMW ActiveHybrid 750i Sedan",
 *       "2011 BMW ActiveHybrid 750Li Sedan"
 *     ]
 *}]
 *
 *
 *
 *
 * @param {moreStats.avgMpgByYearAndHybrid} Object where keys are years and each year
 * an object with keys for `hybrid` and `notHybrid`. The hybrid and notHybrid
 * should be an object with keys for `highway` and `city` average mpg.
 *
 * Only years in the data should be keys.
 *
 * {
 *     2020: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *     2021: {
 *         hybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         },
 *         notHybrid: {
 *             city: average city mpg,
 *             highway: average highway mpg
 *         }
 *     },
 *
 * }
 */
export const moreStats = {
    makerHybrids: getMakerHybrids(),
    avgMpgByYearAndHybrid: getAvgMpgByYearAndHybrid()
};

function getMakerHybrids() {
    var hybrid = mpg_data.filter(a => a.hybrid);
    var temp = [];
    for(var i = 0; i < hybrid.length; i++){
        if(temp.every(b => b.make !== hybrid[i].make) || temp.length == 0) {
            var uid = [hybrid[i].id];
            temp.push({make: hybrid[i].make, hybrids: uid});
        } else {
            var uid2 = temp.findIndex(b => b.make === hybrid[i].make);
            temp[uid2].hybrids.push(hybrid[i].id);
        }
    }
    temp.sort(function(a,b) {
        if(a.hybrids.length >= b.hybrids.length) {
            return - 1;
        } else {
            return 1;
        }
    })
    return temp;
}

function getAvgMpgByYearAndHybrid() {
    var yrs = new Object();
    for (var i = 0; i < mpg_data.length; i++) {
        if (yrs.hasOwnProperty(mpg_data[i].year)) {

        } else {

            var curYearData = mpg_data.filter(a => a.year === mpg_data[i].year);
            var hybrCity = 0;
            var nonHybrCity = 0;
            var hybrHighway = 0;
            var nonHybrHighway = 0;

            var hybrids = 0;
            var nonHybrids = 0;

            for (var j=0; j<curYearData.length; j++) {
                if (curYearData[j].hybrid) {
                    hybrids++
                    hybrCity += curYearData[j].city_mpg
                    hybrHighway += curYearData[j].highway_mpg
                } else {
                    nonHybrids++
                    nonHybrCity += curYearData[j].city_mpg
                    nonHybrHighway += curYearData[j].highway_mpg
                }
            }

            hybrCity = hybrCity / hybrids;
            hybrHighway = hybrHighway / hybrids;
            nonHybrCity = nonHybrCity / nonHybrids;
            nonHybrHighway = nonHybrHighway / nonHybrids;

            var hybr =  new Object()
            Object.defineProperties(hybr, {"city": {value: hybrCity, enumerable: true}, "highway": {value: hybrHighway, enumerable: true}})
            var nonHybr = new Object()
            Object.defineProperties(nonHybr, {"city": {value: nonHybrCity, enumerable: true}, "highway": {value: nonHybrHighway, enumerable: true}})

            var yr = new Object()
            Object.defineProperties(yr, {"hybrid": {value: hybr, enumerable: true}, "notHybrid": {value: nonHybr, enumerable: true}})

            Object.defineProperty(yrs, mpg_data[i].year, {value: yr, enumerable: true})
        }
    }
    return yrs;
}