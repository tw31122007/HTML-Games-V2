/*	Courtesy http://html5tutorial.com/how-to-draw-n-grade-bezier-curve-with-canvas-api/ 
*	due to substantial use of original code:
*/
/* 
*	The MIT License (MIT)
*	
*	Copyright (c) 2012 Scriptoid
*	Permission is hereby granted, free of charge, to any person obtaining a copy 
*	of this software and associated documentation files (the "Software"), to deal 
*	in the Software without restriction, including without limitation the rights 
*	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
*	of the Software, and to permit persons to whom the Software is furnished to 
*	do so, subject to the following conditions:
*	The above copyright notice and this permission notice shall be included in 
*	all copies or substantial portions of the Software.
* 
*	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
*	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
*	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
*	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* 	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
* 	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
*	SOFTWARE.
* 
*	@author Alex Gheorghiu <alex at scriptoid dot com>
*/
import * as Utils from "./utils.js"
/**	Computes Bernstain
 *	@param {Integer} i - the i-th index
 *	@param {Integer} n - the total number of points
 *	@param {Number} t - the value of parameter t , between 0 and 1
 **/
function B(i, n, t) {
	return Utils.factorial(n) / (Utils.factorial(i) * Utils.factorial(n - i)) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}
/** Computes a point's coordinates for a value of t
 *	@param {Number} t - a value between o and 1
 *	@param {Array} points - an {Array} of [x,y] coodinates. The initial points
 **/
function P(t, points) {
	let r = {
		x: 0,
		y: 0,
	};
	let n = points.length - 1;
	for (let i = 0; i <= n; i++) {
		r.x += points[i].x * B(i, n, t);
		r.y += points[i].y * B(i, n, t);
	}
	return r;
}

/* Draws a N grade bezier curve from current point on the context */
export function nGrade(points, res) {
	if (res === undefined) {
		res = 1;
	} 
	// let step = res / tLength;
	/* compute the support points */
	let temp = [];
	for (let t = 0; t <= 1; t += res) {
		temp.push(P(t, points));
	}
	return temp;
}
export function cubic(x1, y1, x2, y2) {
	return this.nGrade([{
		x: 0,
		y: 0,
	}, {
		x: x1,
		y: y1,
	},{
		x: x2,
		y: y2,
	},{
		x: 1,
		y: 1,
	}], 0.025);
}