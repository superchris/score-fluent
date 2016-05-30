import alt from '../libs/alt';
import _ from 'lodash';

import MenuActions from '../actions/MenuActions';
import AuthActions from '../actions/AuthActions';

class MenuStore {

  constructor() {
    this.bindActions(MenuActions);

    this.open = false;
    this.valid = false;
    this.status = null;

    this.items = [
      {
        type: 'button',
        value: 'Register'
      },
      {
        type: 'button',
        value: 'Login'
      },
      {
        type: 'button',
        value: 'Stats'
      }
    ];
  }

  open() {
    if (!this.open) this.setState({open: true});
  }

  close() {
    if (this.open) this.setState({open: false});
  }

  btnClick(btnName) {
    switch (btnName) {
      case 'Register':
        this._setRegisterForm();
        break;
      case 'Login':
        this._setLoginForm();
        break;
      case 'Stats':

        break;
      case 'Back':
        this._setNullForm();
        break;
      case 'Submit':
        if (this.valid) {
          if (this.status == 'register') {
            const body = {
              username: this.items[1].value,
              email: this.items[2].value,
              password: this.items[3].value
            };
            setTimeout(() => AuthActions.register(body), 0);
          } else if (this.status == 'login') {
            const body = {
              id: this.items[1].value,
              password: this.items[2].value
            };
            setTimeout(() => AuthActions.login(body), 0);
          }
        }
        break;
      default:
        console.log('menu-btn click unhandled');
        break;
    }
  }

  updateValidation([placeholder, val]) {
    const fieldIndex = _.findIndex(this.items, {placeholder});
    const o = this.items[fieldIndex];
    o.value = val;
    const regex = o.regex;

    // Validate form value
    if (placeholder.toLowerCase() != 'confirm password') {
      if (val === '' && o.validationState != 'clean') {
        o.validationState = 'clean';
      }
      // if not empty and not already marked dirty, set dirty
      else if (!regex.test(val) && o.validationState != 'dirty') {
        o.validationState = 'dirty';
      }
      else if (regex.test(val) && o.validationState != 'valid') {
        o.validationState = 'valid';
      }
    } else {
      const password = this.items[_.findIndex(this.items, {placeholder: 'Password'})];
      if (val === '' && o.validationState != 'clean') {
        o.validationState = 'clean';
      } else if (val != password.value) {
        o.validationState = 'dirty';
      } else {
        o.validationState = 'valid';
      }
    }

    // Update this.items
    this.items[fieldIndex] = o;
    // Check if form is valid
    this._updateValid();
  }

  _updateValid() {
    let valid = true;
    for (var i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.type == 'input' || item.type == 'password') {
        if (item.validationState != 'valid') {
          valid = false;
          break;
        }
      }
    }
    if (valid) {
      this.setState({valid});
      _.each(this.items, (ele) => {
        if (ele.type == 'validation-button') ele.validationState = 'valid';
      });
    }
  }

  _setNullForm() {
    this.setState({
      valid: false,
      status: null,
      items: [
        {
          type: 'button',
          value: 'Register'
        },
        {
          type: 'button',
          value: 'Login'
        },
        {
          type: 'button',
          value: 'Stats'
        }
      ]
    });
  }

  _setRegisterForm() {
    this.setState({
      valid: false,
      status: 'register',
      items: [
        {
          type: 'button',
          value: 'Back'
        },
        {
          type: 'input',
          placeholder: 'Username',
          value: 'asd',
          regex: /^[A-Za-z\d$@$!%*?&]{3,}/,
          validationState: 'clean'
        },
        {
          type: 'input',
          placeholder: 'Email',
          value: 'a@a.aa',
          regex: /[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,4}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Password',
          value: 'asdfASDF1',
          regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Confirm password',
          value: 'asdfASDF1',
          regex: /\S+/,
          validationState: 'clean'
        },
        {
          type: 'validation-button',
          value: 'Submit',
          validationState: 'clean'
        }
      ]
    });
  }

  _setLoginForm() {
    this.setState({
      status: 'login',
      items: [
        {
          type: 'button',
          value: 'Back'
        },
        {
          type: 'input',
          placeholder: 'Username or Email',
          value: '',
          regex: /^[A-Za-z\d$@$!%*?&]{3,}/,
          validationState: 'clean'
        },
        {
          type: 'password',
          placeholder: 'Password',
          value: '',
          regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/,
          validationState: 'clean'
        },
        {
          type: 'validation-button',
          value: 'Submit'
        }
      ]
    });
  }
}

export default alt.createStore(MenuStore, 'MenuStore');
