import './App.css';
import {SkillTable} from './components'

const tempList = [
  'thing one',
  'thing two',
  'thing three',
  'thing four',
  'thing one',
  'thing one',
  'thing two',
  'thing three',
  'thing four',
  'thing two',
  'thing three',
  'thing four',
];

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <SkillTable skills={tempList}/>
      </header>
    </div>
  );
}

export default App;
