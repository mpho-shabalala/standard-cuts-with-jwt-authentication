/**
 * This class provide an interface of methods wich are used for interaction with the DOM
 * The purpose of the interface provided by this class is to encapsulate and modularise primitive operations with the DOM
 * 
 */

export class UIComponents{
    
    /**
     * form with optional parameters
     * @param {string} id optional attribute
     * @param {string} className optional attribute
     * @param {string} method optional attribute
     * @returns html form element
     */
     createForm = (
         id = null,
         className = null,
         method = null
      ) => {  
         const form = document.createElement('form');
         if(!this.#isNull(id)) form.setAttribute('id', id);
         if(!this.#isNull(className)) form.setAttribute('class', className);
         if(!this.#isNull(method)) form.setAttribute('method', method);
         return form;
     }  

      /**
     * ul with optional parameters
     * @param {string} id optional attribute
     * @param {string} className optional attribute
     * @returns html ul element
     */
     createUL = 
     ( 
        id = null,
        className = null
    ) => {
         const ul = document.createElement('ul');
         if(!this.#isNull(id)) ul.setAttribute('id', id);
         if(!this.#isNull(className)) ul.setAttribute('class', className);
         return ul;
    }

    /**
     * anchor with optional parameters
     * @param {string} id optional attribute
     * @param {string} className optional attribute
     * @param {string} href optional attribute
     * @returns html anchor element
     */
    createAnchor = 
    (
        id = null,
        className = null, href
    ) => {
        const a = document.createElement('ul');
         if(!this.#isNull(id)) a.setAttribute('id', id);
         if(!this.#isNull(className)) a.setAttribute('class', className);
         a.setAttribute('href', href ? href : null);
         return a;
    }
 
    /**
     * card with optional attributes
     * @param {string} id optional attribute
     * @param {string} className optional attribute
     * @returns html card element
     */
     createCard = (
         id = null,
         className = null,
     ) => {
         const card = document.createElement('card');
         if(!this.#isNull(id)) card.setAttribute('id', id);
         if(!this.#isNull(className)) card.setAttribute('class', className);
         return card;
     }
 
 /**
  * li with optional attributes
  * @param {string} id optional attribute
  * @param {string} className optional attribute
  * @returns html li element
  */
     createLI = (
         id = null,
         className = null,
     ) => {
         const li = document.createElement('li');
         if(!this.#isNull(id)) li.setAttribute('id', id);
         if(!this.#isNull(className)) li.setAttribute('class', className);
         return li;
     }
 
     /**
      * row with optional attributes
      * @param {object} objTRowAttributes object format {id: null, class: null} 
      * @returns html row element
      */
     createTRow = (
         id = null,
         className =  null
     ) => {
         const row = document.createElement('tr');
         if(!this.#isNull(id)) row.setAttribute('id', id);
         if(!this.#isNull(className)) row.setAttribute('class', className);
         return row;
     }
 
     /**
      * 
      * @param {string} id optional attribute
      * @param {string} className optional attribute
      * @returns html col element
      */
     createTColumn = (
         id = null,
         className = null
     ) => {
         const col = document.createElement('td');
         if(!this.#isNull(id)) col.setAttribute('id', id);
         if(!this.#isNull(className)) col.setAttribute('class', className);
         return col;
     }
 
   /**
    * image with optional attributes
    * @param {string} src image source path/link
    * @param {string} alt optional parameter
    * @param {string} id optional parameter
    * @param {string} className optional parameter
    * @returns html image element
    */
     createImg = (
         src,
         alt = null,
         id = null,
         className = null
         
     ) => {
         const img = document.createElement('img');
         if(!this.#isNull(id)) img.setAttribute('id', id);
         if(!this.#isNull(className)) img.setAttribute('class', className);
         if(!this.#isNull(alt)) img.setAttribute('alt', alt);
         img.setAttribute('src', src);
         return img;
     }
 
 
     /**
      * @param {string} textContent optional attribute
      * @param {string} id optional attribute
      * @param {string} className optional attribute
      * @returns html paragraph element
      */
     createParagraph = (
         textContent = null,
         id =  null,
         className = null
     ) => {
         const p = document.createElement('p');
         if(!this.#isNull(id)) p.setAttribute('id', id);
         if(!this.#isNull(className)) p.setAttribute('class', className);
         p.textContent = textContent;
         return p;
     }
 
     /**
      * 
      * @param {string} id optional attribute
      * @param {string} className optional attribute
      * @returns html div element
      */
     createDiv = (
         id = null,
         className = null
     ) => {
         const div = document.createElement('div');
         if(!this.#isNull(id)) div.setAttribute('id', id);
         if(!this.#isNull(className)) div.setAttribute('class', className);
         return div;
     }
 
     /**
      * returns header element based on specified headerType
      * @param {string} headerType specifies type of header to create
      * @param {string} textContent specifies the textcontent of the header
      * @param {string} id optional parameter
      * @param {string} className optional parameter, when specified it sets the class attribute
      * @returns html header element
      */
     createHeader = (headerType, textContent, id = null, className = null) => {
         let h = null;
         if(this.#isHeaderValid(headerType)) h = document.createElement(headerType);
         else throw new Error('Header specified is an invalid html header');
 
         if(!this.#isNull(id)) h.setAttribute('id', id);
         if(!this.#isNull(className)) h.setAttribute('class', className);
         h.textContent = textContent;
         return h;
     }

     /**
      * returns button html element
      * @param {string} id optional parameter
      * @param {string} className optional parameter
      * @param {string} textContent must not be empty
      * @returns html button element
      */
     createButton = (id = null, className = null, textContent) => {
        let button = document.createElement('button');
        if(!this.#isNull(id)) button.setAttribute('id', id);
        if(!this.#isNull(className)) button.setAttribute('class', className);
        if(textContent !== '') {
            button.textContent = textContent;
        }else{
            throw new Error('textContent is not empty')
        }
        return button;
     }
 
     /**
      * select element from ui using element's attributes object and element type for verification of the selected element
      * @param {object} objSelectorAttributes format : {id:null, class:null} 
      * attributes object properties have null value by default
      * you must atleast fill in one attribute, id will always be used if it is provided
      * @param {string} elementType element types include javascript identification name for htnl element { img instead of image, p instead of paragraph}, use proper identification names 
      * @returns html element  OR throws an error with this message:`ElementName specified does not exist in the UI`
      * if the selected element isn't valid according to this classe's standards
      */
        getDomElement = (elementType, 
         id = null,
         className = null
        ) => {
         let element = null;
         if(!this.#isNull(id)) element = document.getElementById(id);
         else if(!this.#isNull(className)
         && this.#isNull(id)) element = document.querySelector(`.${className}`);
         else throw new Error(`Element does not exist in the UI`);
         if(!this.#isHTMLElementValid(element, elementType)){
             let longElementTypeName = '';
             if(elementType=='p') longElementTypeName = 'Paragraph';
             if(elementType=='img') longElementTypeName = 'Image';
             if(elementType=='form') longElementTypeName = 'Form';
             if(elementType=='ul') longElementTypeName = 'Unordered-list';
             if(elementType=='btn') longElementTypeName = 'button';
             throw new Error(`${longElementTypeName} specified does not exist in the UI`);
         } 
         return element;
     }

     getAllDomElements(className){
        return document.querySelectorAll(`.${className}`);
     }
 
      /**
      * checks if the element selected exists in the ui and checks if its type matches the one specified by elementType
      * @param {htmlElement} htmlElement element to be validated
      * @param {string} elementType type of element to match
      * @returns true or false
      */
     #isHTMLElementValid(htmlElement, elementType) {
         return (htmlElement !== null) && 
                (htmlElement.nodeName.toLowerCase() === elementType );
     }
 
     // validators
     /**
      * checks if attribute is not null
      * @param {object} objectAttribute attribute to be validated 
      * @returns true or false
      */
     #isNull = (objectAttribute) => {
         return (objectAttribute === null);
     }
 
     #isHeaderValid(headerType){
         return (headerType == 'h1' ||
         headerType == 'h2' || 
         headerType == 'h3' ||
         headerType == 'h4' ||
         headerType == 'h5' ||
         headerType == 'h6');
     }
 }


 