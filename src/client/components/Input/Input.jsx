import React from 'react';
import _ from 'lodash';
const p = React.PropTypes;

import DisplayActions from '../../logic/actions/GameActions';
import MenuActions from '../../logic/actions/MenuActions';

export default class App extends React.Component {

  static propTypes = {
    screen: p.string,
    guessStatus: p.object,
    inputNotes: p.object,
    accidental: p.string,
    answerDelay: p.number
  };

  constructor() {
    super();

    this.state = {
      correctNote: null,
      incorrectNote: null
    };

    this.timeouts = []
  }

  componentWillReceiveProps(nextProps) {
    // Update button animation on props.guessStatus change
    if (this.props.guessStatus && !nextProps.guessStatus ||
        !this.props.guessStatus && nextProps.guessStatus) {

      const status = nextProps.guessStatus;
      // If displaying the result of the last guess
      if (status) {
        // If guess is correct animate correct pitch button
        if (status.guess == 'correct') {
          this.setState({correctNote: status.correct.pitch});
        //  If guess is incorrect animate incorrect pitch button, then animate
        //  correct pitch button after props.answerDelay
        } else {
          this.setState({incorrectNote: status.incorrect.pitch});
          this.timeouts.push(setTimeout(() => {
            this.setState({correctNote: status.correct.pitch});
          }, this.props.answerDelay));
        }
      // GuessStatus is null after new note is set, so remove animations
      } else {
        this.setState({correctNote: null, incorrectNote: null});
      }
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }

  render() {
    this.active = this.props.screen === 'staves';
    const guessStatus = this.props.guessStatus;
    let correct;
    let incorrect;

    // Lord forgive me for I have sinned and manipulated a grandparent's state from here
    const background = document.querySelector('#app-background');
    if (background) background.className = (guessStatus ? guessStatus.guess : '');

    return (
      <div id="keyboard">{this.props.inputNotes[this.props.accidental].map((note, ind) => {
        let status = '';
        // console.log(note, this.state.correctNote);
        if (this.state.correctNote == note) status = ' correct';
        else if (this.state.incorrectNote == note) status = ' incorrect';
        return (
          <button
            key={ind}
            className={'keyboard-button' + status + (this.active ? ' active' : '')}
            onClick={this.guessNote.bind(null, note)}>
            {note}
          </button>
        );
      }
      )}</div>
    );
  }

  guessNote = (pitch) => {
    if (!this.props.guessStatus) {
      DisplayActions.guessNote({pitch, octave: null});
      MenuActions.updateScore();
    }
  };

}
