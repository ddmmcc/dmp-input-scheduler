import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import "@polymer/paper-checkbox/paper-checkbox.js";
import "dmp-paper-checkbox/dmp-paper-checkbox.js";
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import { MutableData } from '@polymer/polymer/lib/mixins/mutable-data.js';

/**
 * `dmp-input-scheduler`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DmpInputScheduler extends MutableData(PolymerElement) {
  static get template() {
    return html`
      <style>
        *{
          /* box-shadow: 0 0 0 1px black; */
        }
        :host {
          display: block;
          --dmp-input-scheduler-primary :  var(--primary-color);
          --dmp-input-scheduler-secundary :  var(--primary-text-color);
          --dmp-input-scheduler-text :  var(--primary-text-color);
          --dmp-input-scheduler-disabled-text :  var(--secondary-text-color);
          --dmp-input-scheduler-error :  var(--error-color);
          --dmp-input-scheduler-warning :  var(--warning-color);
          --dmp-paper-checkbox-size: 40px;
          --dmp-input-scheduler-right-box-size: 80px;

          color: var(--dmp-input-scheduler-text);
        }

        @media(max-width: 420px) {
          :host {
            --dmp-input-scheduler-right-box-size: 60px;
          }
        }

        .rightBox {
          width: var(--dmp-input-scheduler-right-box-size);
          color: var(--dmp-input-scheduler-text);
        }

        .row {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .left_column, .right_column, .center_column{
          display: flex;
          align-items: center;
          flex-flow: column nowrap;
          justify-content: center;
          text-align: center;
        }
        .center_column{
          display: flex;
          align-items: center;
          flex-flow: row nowrap;
          justify-content: space-around;
        }

        .left_column .checks, .right_column .checks, .rightBox .checks{
          width: var(--dmp-paper-checkbox-size);
        }

        .center_column .dropDown {
          width: 40%;
          max-width: 191px;
        }

        .checks{
          --paper-checkbox-size: var(--dmp-paper-checkbox-size);
          --paper-checkbox-radius: 8px;
          --paper-checkbox-unchecked-color : var(--dmp-input-scheduler-primary); /** border */
        }

        [data-text-disabled] {
          color: var(--dmp-input-scheduler-disabled-text);
        }

        .error {
          color: var(--dmp-input-scheduler-error);
        }

        .checkRepeat{
          text-align: right;
          margin-bottom: 20px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .check_day_name{
          color: var(--secondary-text-color);
        }

        .checkRepeatBox {
          display: flex;
          justify-content: center;
        }

      </style>
      <div class="main_container">
        <div class="title">[[title]]</div>
        <div class="error" hidden="[[!showRequiredError]]">[[errorMsg]]</div>
        <div class="checkRepeat">
          <div style='display: inline-block; margin-right: 20px;' data-text-disabled$="[[enableAllDaysTheSame]]">Copiar todos los días igual que el primero</div>
          <div style='display: inline-block'>
              <div class='checkRepeatBox rightBox'>
                <dmp-paper-checkbox data-index="0" on-click="_fullDaysSame" checked="{{allDaysTheSame}}" disabled="[[enableAllDaysTheSame]]" class="checks"></dmp-paper-checkbox>              
              </div>
        </div>
        </div>
        <template is="dom-repeat" items="{{value}}">
          <div class="row">
            <div class="left_column">
              <span class='check_day_name'>[[item.name]]</span>
              <dmp-paper-checkbox class="checks" checked="{{item.checked}}" name="[[item.name]]"></dmp-paper-checkbox>
            </div>
            <div class="center_column">
              <paper-dropdown-menu
                class="dropDown"
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
                class="dropDown"
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

            </div>
            <div class="right_column">
            <div class='rightBox' data-text-disabled$="[[!item.checked]]">Todo el día</div>
              <dmp-paper-checkbox data-index$="[[index]]" on-click="_fullDayClicked" disabled="[[!item.checked]]" class="checks" checked="{{item.fulldayCheck}}"></dmp-paper-checkbox>              
            </div>
          </div>
        </template>
      </div>
    `;
  }
  static get properties() {
    return {
      title: {
        type: String,
      },
      value: {
        type: Array,
        value: [],
        notify: true
      },
      /** Msg error. It shows when component validate and return invalid */
      errorMsg: {
        type: String,
        value: "Please fill required fields"
      },
      /** Property save the validation value */
      invalid: {
        type: Boolean,
        value: false,
        notify: true
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
      enableAllDaysTheSame: {
        type: Boolean,
        computed: "_computeEnableAllDaysTheSame(value.0.checked, value.0.fromSelectTime, value.0.toSelectTime)"
      },
      allDaysTheSame: {
        type: Boolean,
        value: false
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
  
  _computeEnableAllDaysTheSame(checked, fromSelectTime, toSelectTime){
    console.log("_computeEnableFullDay");
    return !checked || !fromSelectTime || !toSelectTime;
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
      this.set(`value.${index}.toSelectedIndex`, this.hours.length - 1);
      //this.notifyPath(`value.${index}`);
    }
  }

  _indexIsZero(index){
    return !index;
  }

  _fullDaysSame(e) {
    console.log(e);
    if ( e.currentTarget.checked ) {
      const index = e.currentTarget.dataset.index;
      const valFrom = this.value[index].fromSelectedIndex;
      const valTo = this.value[index].toSelectedIndex;
      const fulldayCheck = this.value[index].fulldayCheck;
  
      if ( typeof valFrom === "number" && typeof valTo === "number" ){
        this.value.forEach((item, index) => {
          this.set(`value.${index}.checked`, true);
          this.set(`value.${index}.fromSelectedIndex`, valFrom);
          this.set(`value.${index}.toSelectedIndex`, valTo);
          this.set(`value.${index}.fulldayCheck`, fulldayCheck);
        })
      }
    }
  }

  ready() {
    super.ready();
    window.myelement = this;
    if ( this.autoValidate ) {
    }
    
  }

  _valueChanged(chg) {
    if ( chg.path.includes("fromSelectedIndex") || chg.path.includes("toSelectedIndex") ){
      let indexOfValue = (((chg.path.match(/\.\d\./) || "")[0] || "").split(".") || [])[1] || null;
      this._anySelectChanged(chg, indexOfValue, this.value[indexOfValue]);
    }
  }

  _anySelectChanged (chg, indexOfValue, row) {
    if ( chg.path.includes("fromSelectedIndex") ){ // from 
      this.set(`value.${indexOfValue}.fromSelectTime`, this.hours[chg.value]);
    }else { // to
      this.set(`value.${indexOfValue}.toSelectTime`, this.hours[chg.value]);
    }
    this._shouldCheckAllDay(this.value[indexOfValue].fromSelectedIndex, this.value[indexOfValue].toSelectedIndex, indexOfValue);
    this._shouldCheckAllDaysSame(this.value);
    if ( this.autoValidate) {
      this.set(`value.${indexOfValue}.invalid`, this.validateRow(this.value[indexOfValue].checked, this.value[indexOfValue].fromSelectedIndex, this.value[indexOfValue].toSelectedIndex));
    }    
  }

  _shouldCheckAllDay(from, to, index) {
      this.set(`value.${index}.fulldayCheck`, from === 0 && to === this.hours.length - 1);
  }

  _allDaysSameClicked() {
    console.log("clicked all days the same")
    this._shouldCheckAllDaysSame(this.value);
  }

  _shouldCheckAllDaysSame(value) {
    let result = true;
    for ( let i = 0; i < value.length; i++ ) {
      if ( i > 0 ) {
        let itemFrom = value[i].fromSelectedIndex;
        let prevItemFrom = value[i-1].fromSelectedIndex;
        let itemTo = value[i].toSelectedIndex;
        let prevItemTo = value[i-1].toSelectedIndex;
        if ( itemFrom !== prevItemFrom || itemTo !== prevItemTo ) {
          result = false;
          break;
        }
      }
    }
    this.set("allDaysTheSame", result);
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
    const resultInvalid = !items.filter(item => item.fromSelectTime && item.toSelectTime)[0];
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

  reset() {
    this.set("value", []);
    this._constructValue(this.days);
  }
}

window.customElements.define('dmp-input-scheduler', DmpInputScheduler);
