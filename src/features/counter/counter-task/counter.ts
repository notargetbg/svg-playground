/**
 * Counter example task from https://www.greatfrontend.com/questions/javascript/make-counter
 * 
 * Implement a function makeCounter that accepts an optional integer value and returns a function. When the returned function is called
 * initially, it returns the initial value if provided, otherwise 0. The returned function can be called repeatedly to return 1 more than the
 * return value of the previous invocation.
 * 
 * Example:
 * const counter = makeCounter();
 * console.log(counter()); // 0
 * console.log(counter()); // 1
 * 
 * const counter = makeCounter(4);
 * console.log(counter()); // 4
 * console.log(counter()); // 5
 * 
 */

/**
 * @param {number} initialValue
 * @return {Function}
 */

export default function makeCounter(initialValue = 0) {
		let increment = 0;
		return function() {
		const res = initialValue + increment;
		increment++
		return res;
	}
}
  
