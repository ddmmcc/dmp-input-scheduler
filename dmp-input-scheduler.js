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

        [data-text-disabled] {
          color: var(--dmp-input-scheduler-disabled-text);
        }

        .error {
          color: var(--dmp-input-scheduler-error);
        }


      </style>
      <div class="main_container">
        <div class="error" hidden="[[!showRequiredError]]">[[errorMsg]]</div>
        <template is="dom-repeat" items="{{value}}">
          <div class="row">
            <div class="left_column">
              [[item.name]]
              <dmp-paper-checkbox class="checks" checked="{{item.checked}}" name="[[item.name]]">
              </dmp-paper-checkbox>
            </div>
            <div>
              <paper-dropdown-menu
                label="Desde"
                on-value-changed="_onValueChange" 
                on-selected-item-changed="_selectedItemFromChanged"
                disabled="[[!item.checked]]"
                invalid="{{item.invalid}}"
                >
                <paper-listbox slot="dropdown-content" selected="{{item.fromSelectedIndex}}">
                  <template is="dom-repeat" items="[[hours]]">
                    <paper-item>[[item]]</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>

              <paper-dropdown-menu
                label="Hasta"
                on-selected-item-changed="_selectedItemToChanged"
                auto-validate
                disabled="[[!item.checked]]"
                invalid="{{item.invalid}}"
              >
                <paper-listbox slot="dropdown-content" selected="{{item.toSelectedIndex}}">
                  <template is="dom-repeat" items="[[hours]]">
                    <paper-item>[[item]]</paper-item>
                  </template>
                </paper-listbox>
              </paper-dropdown-menu>
              <div style="display: inline-block">
                  <div data-text-disabled$="[[!item.checked]]">Todo el día</div>
                  <dmp-paper-checkbox data-index$="[[index]]" on-click="_fullDayClicked" disabled="[[!item.checked]]" class="checks" checked="{{item.fulldayCheck}}"></dmp-paper-checkbox>              
              </div>
              <template is="dom-if" if="[[_indexIsZero(index)]]">
                <div style="display: inline-block">
                    <div data-text-disabled$="[[!item.checked]]">Todos los días iguales</div>
                    <dmp-paper-checkbox data-index$="[[index]]" on-click="_fullDaysSame" disabled="[[_disableFullDaysSameCheck(item.checked, item.fromSelectedIndex, item.toSelectedIndex)]]" class="checks"></dmp-paper-checkbox>              
                </div>
              </template>
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
      showRequiredError: {
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

  _onValueChange(e) {
    console.log(e.detail)
  }

  _validateFrom(index) {
    console.log("validatingFrom"+index);
    return true;
  }

  _validateTo(index) {
    console.log("validatingTo"+index);
    return true;
  }

  _fullDayClicked(e) {
    console.log(e);
    if ( e.currentTarget.checked ) {
      const index = e.currentTarget.dataset.index;
      this.set(`value.${index}.fromSelectedIndex`, 0)
      this.set(`value.${index}.toSelectedIndex`, this.hours.length - 1)
    }
  }

  _indexIsZero(index){
    return !index;
  }

  _fullDaysSame(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const valFrom = this.value[index].fromSelectedIndex;
    const valTo = this.value[index].toSelectedIndex;

    if ( valFrom && valTo ){
      this.value.forEach((item, index) => {
        this.set(`value.${index}.checked`, true);
        this.set(`value.${index}.fromSelectedIndex`, valFrom);
        this.set(`value.${index}.toSelectedIndex`, valTo);
      })
    }
  }

  _disableFullDaysSameCheck(checked, fromSelectedIndex, toSelectedIndex){
    console.log(toSelectedIndex);
    return !checked || !fromSelectedIndex || !toSelectedIndex;
  }

  ready() {
    super.ready();
    window.myelement = this;
    if ( this.autoValidate ) {
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
      if ( this.autoValidate) {
        this.set(`value.${arIndex}.invalid`, this.validateRow(this.value[arIndex].checked, this.value[arIndex].fromSelectedIndex, this.value[arIndex].toSelectedIndex));
      }
    }
  }
  
  validateRow(checked, fromValue, toValue) {
    return (checked && !(fromValue < toValue));
  }

  reset() {
    this.value = [];
  }
  

  validate() {
    this.showRequiredError = false;
    this.prune();
    this._validateRequired(this.value);
    this._validateRanges(this.value);
    // tengo que validar on focus, y tiene que vigilar, que todos los elementeos estén dentro de rango y hacer un prune

  }

  _validateRequired(items) {
    const resultInvalid = !items.filter(item => item.fromSelected && item.toSelected)[0];
    this.showRequiredError = resultInvalid;
    this.invalid = this.invalid && !resultInvalid ? this.invalid : resultInvalid;
  }

  /** validate if from is minor than to */
  _validateRanges(items) {
    this.invalid = false;
    items.forEach((item, index) => {
      const result = this.validateRow(item.checked, item.fromSelectedIndex, item.toSelectedIndex);
      if ( result ) {
        this.invalid = result;
      }
      this.set(`value.${index}.invalid`, result)
      //item.invalid = item.checked && !(item.fromSelectedIndex < item.toSelectedIndex)
    });
  }

  prune() {
      this.value = this.value.map( (item, index) => {
      return item.checked ? item : {name: this.days[index]};
    })
  }

  _constructValue(days) {
    console.log("me he ejecutado");
    this.value = days.map((item) => {return {name: item, checked: false} });
  }
}

window.customElements.define('dmp-input-scheduler', DmpInputScheduler);
