/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    height,
    width,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const descriptors = Object.getOwnPropertyDescriptors(JSON.parse(json));
  return Object.create(proto, descriptors);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  result: '',
  order: 0,
  occurEl: 0,
  occurId: 0,
  occurPE: 0,
  // eslint-disable-next-line no-unused-vars
  checkOrder(order) {
    if (this.order > order) {
    // eslint-disable-next-line max-len
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  },
  // eslint-disable-next-line no-unused-vars
  checkOccur(occur) {
    // eslint-disable-next-line max-len
    if (occur === 1) {
      console.log(occur);
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
  },
  element(value) {
    this.checkOrder(1);
    this.checkOccur(this.occurEl);
    // this.occurEl = 1;
    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.order = 1;
    // cssObject.checkOccur(cssObject.occurEl);
    cssObject.occurEl = 1;
    cssObject.result = `${this.result}${value}`;

    return cssObject;
  },

  id(value) {
    this.checkOrder(2);
    this.checkOccur(this.occurId);
    const cssObject = Object.create(cssSelectorBuilder);
    // cssObject.checkOccur(cssObject.occurEl);
    cssObject.order = 2;
    cssObject.occurId = 1;
    cssObject.result = `${this.result}#${value}`;
    return cssObject;
  },

  class(value) {
    this.checkOrder(3);

    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.order = 3;
    cssObject.result = `${this.result}.${value}`;
    return cssObject;
  },

  attr(value) {
    this.checkOrder(4);

    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.order = 4;
    cssObject.result = `${this.result}[${value}]`;
    return cssObject;
  },

  pseudoClass(value) {
    this.checkOrder(5);

    const cssObject = Object.create(cssSelectorBuilder);
    cssObject.order = 5;
    cssObject.result = `${this.result}:${value}`;
    return cssObject;
  },

  pseudoElement(value) {
    this.checkOrder(6);
    this.checkOccur(this.occurPE);
    const cssObject = Object.create(cssSelectorBuilder);
    // cssObject.checkOccur(cssObject.occurEl);
    cssObject.order = 6;
    cssObject.occurPE = 1;
    cssObject.result = `${this.result}::${value}`;
    return cssObject;
  },

  combine(selector1, combinator, selector2) {
    const comb = Object.create(cssSelectorBuilder);
    comb.result = `${selector1.result} ${combinator} ${selector2.result}`;
    return comb;
  },
  stringify() {
    return this.result;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
