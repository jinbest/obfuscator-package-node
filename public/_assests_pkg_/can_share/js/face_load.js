/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
! function (t, e) {
	"object" == typeof exports && "undefined" != typeof module ? e(exports, require("@tensorflow/tfjs-core"), require("@tensorflow/tfjs-converter")) : "function" == typeof define && define.amd ? define(["exports", "@tensorflow/tfjs-core", "@tensorflow/tfjs-converter"], e) : e(t.facemesh = {}, t.tf, t.tf)
}(this, function (t, e, s) {
	"use strict";
	const n = t => {
			t.startEndTensor.dispose(), t.startPoint.dispose(), t.endPoint.dispose()
		},
		o = t => ({
			startEndTensor: t,
			startPoint: e.slice(t, [0, 0], [-1, 2]),
			endPoint: e.slice(t, [0, 2], [-1, 2])
		}),
		i = (t, s) => {
			const n = e.mul(t.startPoint, s),
				i = e.mul(t.endPoint, s),
				r = e.concat2d([n, i], 1);
			return o(r)
		},
		r = {
			strides: [8, 16],
			anchors: [2, 6]
		},
		a = 6;

	function c(t, s) {
		let n, o, i;
		if (t.topLeft instanceof e.Tensor && t.bottomRight instanceof e.Tensor) {
			const [r, a] = e.tidy(() => [e.concat([e.sub(s - 1, t.topLeft.slice(0, 1)), t.topLeft.slice(1, 1)]), e.concat([e.sub(s - 1, t.bottomRight.slice(0, 1)), t.bottomRight.slice(1, 1)])]);
			n = r, o = a, null != t.landmarks && (i = e.tidy(() => {
				const n = e.sub(e.tensor1d([s - 1, 0]), t.landmarks),
					o = e.tensor1d([1, -1]);
				return e.mul(n, o)
			}))
		} else {
			const [e, r] = t.topLeft, [a, c] = t.bottomRight;
			n = [s - 1 - e, r], o = [s - 1 - a, c], null != t.landmarks && (i = t.landmarks.map(t => [s - 1 - t[0], t[1]]))
		}
		const r = {
			topLeft: n,
			bottomRight: o
		};
		return null != i && (r.landmarks = i), null != t.probability && (r.probability = t.probability instanceof e.Tensor ? t.probability.clone() : t.probability), r
	}

	function l(t, s) {
		return e.tidy(() => {
			let e;
			return e = t.hasOwnProperty("box") ? t.box : t, i(e, s).startEndTensor.squeeze()
		})
	}
	class h {
		constructor(t, s, n, o, i, a) {
			this.blazeFaceModel = t, this.width = s, this.height = n, this.maxFaces = o, this.anchorsData = function (t, e, s) {
				const n = [];
				for (let o = 0; o < s.strides.length; o++) {
					const i = s.strides[o],
						r = Math.floor((e + i - 1) / i),
						a = Math.floor((t + i - 1) / i),
						c = s.anchors[o];
					for (let t = 0; t < r; t++) {
						const e = i * (t + .5);
						for (let t = 0; t < a; t++) {
							const s = i * (t + .5);
							for (let t = 0; t < c; t++) n.push([s, e])
						}
					}
				}
				return n
			}(s, n, r), this.anchors = e.tensor2d(this.anchorsData), this.inputSizeData = [s, n], this.inputSize = e.tensor1d([s, n]), this.iouThreshold = i, this.scoreThreshold = a
		}
		async getBoundingBoxes(t, s, n = !0) {
			const [i, r, c] = e.tidy(() => {
				const s = t.resizeBilinear([this.width, this.height]),
					n = e.mul(e.sub(s.div(255), .5), 2),
					o = this.blazeFaceModel.predict(n).squeeze(),
					i = function (t, s, n) {
						const o = e.slice(t, [0, 1], [-1, 2]),
							i = e.add(o, s),
							r = e.slice(t, [0, 3], [-1, 2]),
							a = e.div(r, n),
							c = e.div(i, n),
							l = e.div(a, 2),
							h = e.sub(c, l),
							d = e.add(c, l),
							u = e.mul(h, n),
							f = e.mul(d, n);
						return e.concat2d([u, f], 1)
					}(o, this.anchors, this.inputSize),
					r = e.slice(o, [0, 0], [-1, 1]);
				return [o, i, e.sigmoid(r).squeeze()]
			}), l = console.warn;
			console.warn = (() => {});
			const h = e.image.nonMaxSuppression(r, c, this.maxFaces, this.iouThreshold, this.scoreThreshold);
			console.warn = l;
			const d = await h.array();
			h.dispose();
			let u = d.map(t => e.slice(r, [t, 0], [1, -1]));
			s || (u = await Promise.all(u.map(async t => {
				const e = await t.array();
				return t.dispose(), e
			})));
			const f = t.shape[1],
				p = t.shape[2];
			let m;
			m = s ? e.div([p, f], this.inputSize) : [p / this.inputSizeData[0], f / this.inputSizeData[1]];
			const g = [];
			for (let t = 0; t < u.length; t++) {
				const r = u[t],
					l = e.tidy(() => {
						const l = o(r instanceof e.Tensor ? r : e.tensor2d(r));
						if (!n) return l;
						const h = d[t];
						let u;
						return u = s ? this.anchors.slice([h, 0], [1, 2]) : this.anchorsData[h], {
							box: l,
							landmarks: e.slice(i, [h, a - 1], [1, -1]).squeeze().reshape([a, -1]),
							probability: e.slice(c, [h], [1]),
							anchor: u
						}
					});
				g.push(l)
			}
			return r.dispose(), c.dispose(), i.dispose(), {
				boxes: g,
				scaleFactor: m
			}
		}
		async estimateFaces(t, s = !1, o = !1, i = !0) {
			const [, r] = function (t) {
				return t instanceof e.Tensor ? [t.shape[0], t.shape[1]] : [t.height, t.width]
			}(t), a = e.tidy(() => (t instanceof e.Tensor || (t = e.browser.fromPixels(t)), t.toFloat().expandDims(0))), {
				boxes: h,
				scaleFactor: d
			} = await this.getBoundingBoxes(a, s, i);
			return a.dispose(), s ? h.map(t => {
				const e = l(t, d);
				let s = {
					topLeft: e.slice([0], [2]),
					bottomRight: e.slice([2], [2])
				};
				if (i) {
					const {
						landmarks: e,
						probability: n,
						anchor: o
					} = t, i = e.add(o).mul(d);
					s.landmarks = i, s.probability = n
				}
				return o && (s = c(s, r)), s
			}) : Promise.all(h.map(async t => {
				const e = l(t, d);
				let s;
				if (i) {
					const [o, i, r] = await Promise.all([t.landmarks, e, t.probability].map(async t => t.array())), a = t.anchor, [c, l] = d, h = o.map(t => [(t[0] + a[0]) * c, (t[1] + a[1]) * l]);
					s = {
						topLeft: i.slice(0, 2),
						bottomRight: i.slice(2),
						landmarks: h,
						probability: r
					}, n(t.box), t.landmarks.dispose(), t.probability.dispose()
				} else {
					const t = await e.array();
					s = {
						topLeft: t.slice(0, 2),
						bottomRight: t.slice(2)
					}
				}
				return e.dispose(), o && (s = c(s, r)), s
			}))
		}
	}
	const d = "./js/det";
	const u = {
		silhouette: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
		lipsUpperOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
		lipsLowerOuter: [146, 91, 181, 84, 17, 314, 405, 321, 375, 291],
		lipsUpperInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308],
		lipsLowerInner: [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
		rightEyeUpper0: [246, 161, 160, 159, 158, 157, 173],
		rightEyeLower0: [33, 7, 163, 144, 145, 153, 154, 155, 133],
		rightEyeUpper1: [247, 30, 29, 27, 28, 56, 190],
		rightEyeLower1: [130, 25, 110, 24, 23, 22, 26, 112, 243],
		rightEyeUpper2: [113, 225, 224, 223, 222, 221, 189],
		rightEyeLower2: [226, 31, 228, 229, 230, 231, 232, 233, 244],
		rightEyeLower3: [143, 111, 117, 118, 119, 120, 121, 128, 245],
		rightEyebrowUpper: [156, 70, 63, 105, 66, 107, 55, 193],
		rightEyebrowLower: [35, 124, 46, 53, 52, 65],
		leftEyeUpper0: [466, 388, 387, 386, 385, 384, 398],
		leftEyeLower0: [263, 249, 390, 373, 374, 380, 381, 382, 362],
		leftEyeUpper1: [467, 260, 259, 257, 258, 286, 414],
		leftEyeLower1: [359, 255, 339, 254, 253, 252, 256, 341, 463],
		leftEyeUpper2: [342, 445, 444, 443, 442, 441, 413],
		leftEyeLower2: [446, 261, 448, 449, 450, 451, 452, 453, 464],
		leftEyeLower3: [372, 340, 346, 347, 348, 349, 350, 357, 465],
		leftEyebrowUpper: [383, 300, 293, 334, 296, 336, 285, 417],
		leftEyebrowLower: [265, 353, 276, 283, 282, 295],
		midwayBetweenEyes: [168],
		noseTip: [1],
		noseBottom: [2],
		noseRightCorner: [98],
		noseLeftCorner: [327],
		rightCheek: [205],
		leftCheek: [425]
	};

	function f(t) {
		null != t && null != t.startPoint && (t.startEndTensor.dispose(), t.startPoint.dispose(), t.endPoint.dispose())
	}

	function p(t, s, n) {
		return {
			startEndTensor: t,
			startPoint: null != s ? s : e.slice(t, [0, 0], [-1, 2]),
			endPoint: null != n ? n : e.slice(t, [0, 2], [-1, 2])
		}
	}

	function m(t) {
		return e.tidy(() => {
			const s = e.sub(t.endPoint, t.startPoint);
			return e.abs(s)
		})
	}

	function g(t, s = 1.5) {
		return e.tidy(() => {
			const n = function (t) {
					return e.tidy(() => {
						const s = e.div(e.sub(t.endPoint, t.startPoint), 2);
						return e.add(t.startPoint, s)
					})
				}(t),
				o = m(t),
				i = e.mul(e.div(o, 2), s),
				r = e.sub(n, i),
				a = e.add(n, i);
			return p(e.concat2d([r, a], 1), r, a)
		})
	}
	const b = 468,
		y = .25;
	class x {
		constructor(t, e, s, n, o, i) {
			this.regionsOfInterest = [], this.runsWithoutFaceDetector = 0, this.boundingBoxDetector = t, this.meshDetector = e, this.meshWidth = s, this.meshHeight = n, this.maxContinuousChecks = o, this.maxFaces = i
		}
		async predict(t) {
			if (this.shouldUpdateRegionsOfInterest()) {
				const s = !0,
					n = !1,
					{
						boxes: o,
						scaleFactor: i
					} = await this.boundingBoxDetector.getBoundingBoxes(t, s, n);
				if (0 === o.length) return i.dispose(), this.clearAllRegionsOfInterest(), null;
				const r = o.map(t => g(function (t, s) {
					const n = e.mul(t.startPoint, s),
						o = e.mul(t.endPoint, s);
					return p(e.concat2d([n, o], 1))
				}(t, i)));
				o.forEach(f), this.updateRegionsOfInterest(r), this.runsWithoutFaceDetector = 0
			} else this.runsWithoutFaceDetector++;
			return e.tidy(() => this.regionsOfInterest.map((s, n) => {
				const o = function (t, s, n) {
						const o = s.shape[1],
							i = s.shape[2],
							r = t.startEndTensor;
						return e.tidy(() => {
							const t = e.concat2d([r.slice([0, 1], [-1, 1]), r.slice([0, 0], [-1, 1]), r.slice([0, 3], [-1, 1]), r.slice([0, 2], [-1, 1])], 0),
								a = e.div(t.transpose(), [o, i, o, i]);
							return e.image.cropAndResize(s, a, [0], n)
						})
					}(s, t, [this.meshHeight, this.meshWidth]).div(255),
					[, i, r] = this.meshDetector.predict(o),
					a = e.reshape(r, [-1, 3]),
					c = e.div(m(s), [this.meshWidth, this.meshHeight]),
					l = e.mul(a, c.concat(e.tensor2d([1], [1, 1]), 1)).add(s.startPoint.concat(e.tensor2d([0], [1, 1]), 1)),
					h = this.calculateLandmarksBoundingBox(l);
				return f(this.regionsOfInterest[n]), this.regionsOfInterest[n] = h, {
					coords: a,
					scaledCoords: l,
					box: h,
					flag: i.squeeze()
				}
			}))
		}
		updateRegionsOfInterest(t) {
			for (let e = 0; e < t.length; e++) {
				const s = t[e],
					n = this.regionsOfInterest[e];
				let o = 0;
				if (n && n.startPoint) {
					const [t, e, i, r] = s.startEndTensor.arraySync()[0], [a, c, l, h] = n.startEndTensor.arraySync()[0], d = Math.max(t, a), u = Math.max(e, c), f = (Math.min(i, l) - d) * (Math.min(r, h) - u);
					o = f / ((i - t) * (r - e) + (l - a) * (h - e) - f)
				}
				o > y ? f(s) : (this.regionsOfInterest[e] = s, f(n))
			}
			for (let e = t.length; e < this.regionsOfInterest.length; e++) f(this.regionsOfInterest[e]);
			this.regionsOfInterest = this.regionsOfInterest.slice(0, t.length)
		}
		clearRegionOfInterest(t) {
			null != this.regionsOfInterest[t] && (f(this.regionsOfInterest[t]), this.regionsOfInterest = [...this.regionsOfInterest.slice(0, t), ...this.regionsOfInterest.slice(t + 1)])
		}
		clearAllRegionsOfInterest() {
			for (let t = 0; t < this.regionsOfInterest.length; t++) f(this.regionsOfInterest[t]);
			this.regionsOfInterest = []
		}
		shouldUpdateRegionsOfInterest() {
			const t = this.regionsOfInterest.length,
				e = 0 === t;
			return 1 === this.maxFaces || e ? e : t !== this.maxFaces && this.runsWithoutFaceDetector >= this.maxContinuousChecks
		}
		calculateLandmarksBoundingBox(t) {
			const s = t.slice([0, 0], [b, 1]),
				n = t.slice([0, 1], [b, 1]);
			return g(p(e.stack([s.min(), n.min(), s.max(), n.max()]).expandDims(0)))
		}
	}
	const w = "./js/lan",
		P = 192,
		E = 192;

	function O(t, s) {
		if (t.mesh instanceof e.Tensor) {
			const [n, o, i, r] = e.tidy(() => {
				const n = e.tensor1d([s - 1, 0, 0]),
					o = e.tensor1d([1, -1, 1]);
				return e.tidy(() => [e.concat([e.sub(s - 1, t.boundingBox.topLeft.slice(0, 1)), t.boundingBox.topLeft.slice(1, 1)]), e.concat([e.sub(s - 1, t.boundingBox.bottomRight.slice(0, 1)), t.boundingBox.bottomRight.slice(1, 1)]), e.sub(n, t.mesh).mul(o), e.sub(n, t.scaledMesh).mul(o)])
			});
			return Object.assign({}, t, {
				boundingBox: {
					topLeft: n,
					bottomRight: o
				},
				mesh: i,
				scaledMesh: r
			})
		}
		return Object.assign({}, t, {
			boundingBox: {
				topLeft: [s - 1 - t.boundingBox.topLeft[0], t.boundingBox.topLeft[1]],
				bottomRight: [s - 1 - t.boundingBox.bottomRight[0], t.boundingBox.bottomRight[1]]
			},
			mesh: t.mesh.map(t => {
				const e = t.slice(0);
				return e[0] = s - 1 - t[0], e
			}),
			scaledMesh: t.scaledMesh.map(t => {
				const e = t.slice(0);
				return e[0] = s - 1 - t[0], e
			})
		})
	}
	class I {
		constructor(t, e, s, n, o) {
			this.pipeline = new x(t, e, P, E, s, o), this.detectionConfidence = n
		}
		static getAnnotations() {
			return u
		}
		async estimateFaces(t, s = !1, n = !1) {
			const [, o] = function (t) {
				return t instanceof e.Tensor ? [t.shape[0], t.shape[1]] : [t.height, t.width]
			}(t), i = e.tidy(() => (t instanceof e.Tensor || (t = e.browser.fromPixels(t)), t.toFloat().expandDims(0))), r = e.env().get("WEBGL_PACK_DEPTHWISECONV");
			e.env().set("WEBGL_PACK_DEPTHWISECONV", !0);
			const a = await this.pipeline.predict(i);
			return e.env().set("WEBGL_PACK_DEPTHWISECONV", r), i.dispose(), null != a && a.length > 0 ? Promise.all(a.map(async(t, e) => {
				const {
					coords: i,
					scaledCoords: r,
					box: a,
					flag: c
				} = t;
				let l = [c];
				s || (l = l.concat([i, r, a.startPoint, a.endPoint]));
				const h = await Promise.all(l.map(async t => t.array())),
					d = h[0];
				if (c.dispose(), d < this.detectionConfidence && this.pipeline.clearRegionOfInterest(e), s) {
					const t = {
						faceInViewConfidence: d,
						mesh: i,
						scaledMesh: r,
						boundingBox: {
							topLeft: a.startPoint.squeeze(),
							bottomRight: a.endPoint.squeeze()
						}
					};
					return n ? O(t, o) : t
				}
				const [f, p, m, g] = h.slice(1);
				r.dispose(), i.dispose();
				let b = {
					faceInViewConfidence: d,
					boundingBox: {
						topLeft: m,
						bottomRight: g
					},
					mesh: f,
					scaledMesh: p
				};
				n && (b = O(b, o));
				const y = {};
				for (const t in u) y[t] = u[t].map(t => b.scaledMesh[t]);
				return b.annotations = y, b
			})) : []
		}
	}
	t.load = async function ({
		maxContinuousChecks: t = 5,
		detectionConfidence: e = .9,
		maxFaces: n = 10,
		iouThreshold: o = .3,
		scoreThreshold: i = .75
	} = {}) {
		const [r, a] = await Promise.all([async function (t, e, n) {
			return async function ({
				maxFaces: t = 10,
				inputWidth: e = 128,
				inputHeight: n = 128,
				iouThreshold: o = .3,
				scoreThreshold: i = .75
			} = {}) {
				const r = await s.loadGraphModel(d, {
					fromTFHub: !0
				});
				return new h(r, e, n, t, o, i)
			}({
				maxFaces: t,
				iouThreshold: e,
				scoreThreshold: n
			})
		}(n, o, i), async function () {
			return s.loadGraphModel(w, {
				fromTFHub: !0
			})
		}()]);
		return new I(r, a, t, e, n)
	}, t.FaceMesh = I, Object.defineProperty(t, "__esModule", {
		value: !0
	})
});
