/**
* An event-listener, reified into a Custom Element.
*/
class DeclaredListenerElement extends HTMLElement {
	static get observedAttributes(){ return [ "type", "capture", "once", "passive", "on"]}
	constructor(){
		super()
		this.handler= this.handler.bind( this)
		var props= {}
		DeclaredListenerElement.observedAttributes.forEach( attr=> {
			this[ '_'+ _attr]= this.getAttribute( attr)
		})
	}
	connectedCallback(){
		this.declaredParent = this.parentNode
		var options= enhancedListeners? this: this.capture
		this.declaredParent.addEventListener( this.type, this.handler, options)
	}
	disconnectedCallback(){
		this.declaredParent&& this.declaredParent.removeEventListener( this.type, this.handler)
		this.declaredParent = null
	}
	adoptedCallback(oldDocument, newDocument){
		this.declaredParent=  this.parentNode
	}
	attributeChangedCallback(attrName, oldValue, newValue, namespace){
		this.disconnectedCallback()
		this[attrName]= newValue
		this.connectedCallback()
	}
	handler(e){
		eval( this.on, e, this)

		// it'd be neat to be able to "point" (#id-ref? query-selector?) to a HTMLScriptElement
		// and run, like for ex, the default export as a function.
		// uh it doesn't even need to "point", it could literally just run any children it has?
		// for src=, we'd probably have to import() & use default export
		// for textContent, import() a data-blob url with the module text?
		// would be a small courtesy if the DOM had gotten *any* upgrades to expose new context about the module on the DOM but it's all opaque
	}

	get type(){
		return this._type
	}
	get capture(){
		return this._capture
	}
	get once(){
		return this._once
	}
	get passive(){
		return this._passive
	}
	get on(){
		return this._on
	}

	set type( val){
		this._type= val
	}
	set capture( val){
		this._capture= val
	}
	set once( val){
		this._once= val
	}
	set passive( val){
		this._passive= val
	}
	set on( val){
		this._on= val
	}
}

var enhancedListeners= true
try{
	window.addEventListener( "test", null, options)
	enhancedListeners= false
	var options= Object.defineProperty({}, "passive", {
		get: ()=> enhancedListeners= true
	})
	window.addEventListener( "test", null, options)
}catch( err){}

customElements.define( "declared-listener", DeclaredListenerElement)
