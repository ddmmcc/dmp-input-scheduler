import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import "@polymer/paper-checkbox/paper-checkbox.js";
import "dmp-paper-checkbox/dmp-paper-checkbox.js";
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';

/**
 * `dmp-input-scheduler`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DmpInputScheduler extends PolymerElement {
  static get template() {
    return html`
      <style>
        *{
          /* box-shadow: 0 0 0 1px black; */
        }
        :host {
          display: block;
          --dmp-input-scheduler-primary :  #13C1AC;
          --dmp-input-scheduler-secundary :  #636363;
          --dmp-input-scheduler-text :  #636363;
          --dmp-input-scheduler-disabled-text :  #A6A6A6;
          --dmp-input-scheduler-error :  #DE7A7A;
          --dmp-input-scheduler-warning :  #FFD64E;

          --primary-color : var(--dmp-input-scheduler-primary);
          --primary-text-color : var(--dmp-input-scheduler-text);
        }

        .row{
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .left_column{
          display: flex;
          align-items: center;          
        }

        .checks{
          --paper-checkbox-size: 40px;
          --paper-checkbox-radius: 8px;
          --paper-checkbox-unchecked-color : var(--dmp-input-scheduler-primary); /** border */

        }


      </style>
      <div class="main_container">
        <template is="dom-repeat" items="{{value}}">
          <div class="row">
            <div class="left_column">
              [[item.name]]
              <dmp-paper-checkbox class="checks" checked="{{item.checked}}" name="[[item.name]]">
              </dmp-paper-checkbox>
            </div>
            <div>
              <paper-dropdown-menu no-animation label="Desde" on-selected-item-changed="_selectedItemFromChanged" auto-validate disabled="[[!item.checked]]">
                <paper-listbox slot="dropdown-content" selected="{{item.fromSelectedIndex}}">
                  <template is="dom-repeat" items="[[hours]]">
                    <paper-item>[[item]]</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>

              <paper-dropdown-menu no-animation label="Hasta" on-selected-item-changed="_selectedItemToChanged" auto-validate disabled="[[!item.checked]]">
                <paper-listbox slot="dropdown-content" selected="{{item.toSelectedIndex}}">
                  <template is="dom-repeat" items="[[hours]]">
                    <paper-item>[[item]]</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>
            </div>
          </div>
        </template>
      </div>
    `;
  }
  static get properties() {
    return {
      value: {
        type: Array,
        value: [],
      },
      /** Msg error. It shows when component validate and return invalid */
      errorMsg: {
        type: String,
        value: "Please fill required fields"
      },
      /** Proverty save the validation value */
      invalid: {
        type: Boolean,
        value: false
      },
      /** This prop is a flag to validate if required fields of the component are filled */
      required: {
        type: Boolean,
        value: false
      },
      days: {
        type: Array,
        observer: "_constructValue"
      }, 
      hours: {
        type: Array,
        value: [
          "00:00",
          "01:00",
          "02:00",
          "03:00",
          "04:00",
          "05:00",
          "06:00",
          "07:00",
          "08:00",
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
          "19:00",
          "20:00",
          "21:00",
          "22:00",
          "23:00",
          "24:00",          
        ]
      },
      autoValidate: {
        type: Boolean,
        value: false,
      }

    };
  }

  static get observers () {
    return [
      "_valueChanged(value.*)",
    ]
  }

  _selectedItemFromChanged(e) {
    console.log(e.detail);
  }

  _selectedItemToChanged(e) {
    console.log(e.detail);
  }

  _onValueChaneg(e) {
    console.log("onValueChanged")
  }

  _validateFrom(index) {
    console.log("validatingFrom"+index);
    return true;
  }

  _validateTo(index) {
    console.log("validatingTo"+index);
    return true;
  }

  ready() {
    super.ready();
    window.myelement = this;
    if ( this.autoValidate ) {
      this.addEventListener("blur", e => this.validate());
    }

    // TODO: quitar, solo para pruebas
    
  }

  // TODO: no se guarda el checked de los checkboxes - lo mismo le falta el notify al warpper
  _valueChanged(chg) { 
    if ( chg.path.includes("fromSelectedIndex") || chg.path.includes("toSelectedIndex") ){
      let arIndex = (((chg.path.match(/\.\d\./) || "")[0] || "").split(".") || [])[1] || null;
      if ( chg.path.includes("fromSelectedIndex")  ){
        this.value[arIndex].fromSelectTime = this.hours[chg.value];
      }else {
        this.value[arIndex].toSelectTime = this.hours[chg.value];
      }
      this._autoValidate(this.value[arIndex].fromSelectedIndex, this.value[arIndex].toSelectedIndex);
    }
  }

  _autoValidate(fromValue, toValue) {

  }

  reset() {
    this.value = [];
  }
  

  validate() {
    this.prune();
    // tengo que validar on focus, y tiene que vigilar, que todos los elementeos estén dentro de rango y hacer un prune

  }

  prune(){
    console.log("prunning");
      this.value = this.value.map( (item, index) => {
      if ( item.checked ) {
        return item;
      }else{
        return {name: this.days[index]}
      }
    })
  }

  _constructValue(days) {
    console.log("me he ejecutado");
    this.value = days.map((item) => {return {name: item, checked: false} });
  }
}

window.customElements.define('dmp-input-scheduler', DmpInputScheduler);
