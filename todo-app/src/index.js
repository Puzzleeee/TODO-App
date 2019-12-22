import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

let todo_data = [];

function Todoitem(props) {
	return(
		<div className="itemcontainer" onMouseDown={props.onmousedown} onMouseUp={props.onmouseup}>
			<span className={props.item.completed ? "completed" : "todo-item"}>
				<input type="checkbox" checked={props.item.completed} onChange={() => props.onclick(props.item.id)}/>
				<span> 
					{props.item.text}
				</span>
			</span>
			<button className="crossbutton" name="xbutton" onClick={() => props.onsubmit(props.item.id)}>     X</button> 
		</div>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lst:todo_data,
			newtask: ""
		};
		this.checkOff = this.checkOff.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleButtonPress = this.handleButtonPress.bind(this);
		this.handleButtonRelease = this.handleButtonRelease.bind(this);

	}

	checkOff(i) {
		const copied = this.state.lst.slice();
		copied[i].completed = !copied[i].completed;
		this.setState(
			{lst:copied,
			 newtask: ""
			}
		);
	}

	handleChange(event) {
		const {name, value} = event.target;
		this.setState({
			[name]: value
		})
	}

	handleSubmit(event) {
		event.preventDefault();
		const new_id = this.state.lst.length;
		const new_text = this.state.newtask;
		const new_task = {id:new_id, text:new_text, completed:false,}
		const copied = this.state.lst.slice();
		copied.push(new_task);
		this.setState({
			lst:copied,
			newtask: ""
		});
	}

	handleRemove(i) {
		const copied = this.state.lst.slice();
		copied.splice(i, 1);
		for (let i = 0; i < copied.length; i++) {
			copied[i].id = i; 
		}
		this.setState({
			lst:copied,
			newtask: ""
		})
	}

	handleButtonPress() {
		this.buttonPressTimer = setTimeout(() => alert("Long press activated"), 1500);
	}

	handleButtonRelease() {
		clearTimeout(this.buttonPressTimer);
	}

	

	render() {
		const todo_lst = this.state.lst.map(items => <Todoitem key={items.id} item={items} onclick={this.checkOff} onsubmit={this.handleRemove}
														onmousedown={this.handleButtonPress} onmouseup={this.handleButtonRelease}/>);
		return(
			<div className="container">
				<div>
					<ul>
						{todo_lst.map(x => <li key={x.key}> {x} </li>)}
					</ul>
				</div>
				<div>
					<Addbox handleSubmit={this.handleSubmit} handleChange={this.handleChange} value={this.state.newtask} />
				</div>
			</div>
		);
	}
}

class Addbox extends React.Component {
	render() {
		return(
			<div>
				<form onSubmit={this.props.handleSubmit}>
					<label htmlFor="addbox"> Add new task: </label>
					<textarea id="addbox" name="newtask" value={this.props.value} onChange={this.props.handleChange}/>
					<br/>
					<button>Add</button>
				</form>
			</div>

		)
	}
}


ReactDOM.render(
	<App />,
	document.getElementById('root')
	);