import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

let todo_data = [];

function Todoitem(props) {
	return(
		<div className="itemcontainer" onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}>
			<span className={props.item.completed ? "completed" : "todo-item"}>
				<input id={props.item.id} name="check" type="checkbox" checked={props.item.completed} onChange={props.onChange}/>
				<span> 
					{props.item.text}
				</span>
			</span>
			<button id={props.item.id} className="crossbutton" name="xbutton" onClick={props.onChange}>     X</button> 
		</div>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lst:todo_data,
			newtask: "",
			popup: false,
			popupid: Infinity
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleButtonPress = this.handleButtonPress.bind(this);
		this.handleButtonRelease = this.handleButtonRelease.bind(this);

	}

	handleChange(event) {
		const {name, value} = event.target;
		if (name === "xbutton") {
			const idx = event.target.id;
			const copied = this.state.lst.slice();
			copied.splice(idx, 1);
			for (let i = 0; i < copied.length; i++) {
				copied[i].id = i; 
			}
			this.setState({
				lst:copied,
				newtask: ""
			})
		} else if (name === "check") {
			const idx = event.target.id;
			const copied = this.state.lst.slice();
			copied[idx].completed = !copied[idx].completed;
			this.setState({
				lst:copied,
			});
		} else {
			this.setState({
				[name] : value
			})
		}
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

	handleButtonPress() {
		this.buttonPressTimer = setTimeout(() => this.setState(prev => ({popup: !prev.popup})), 1500);
	}

	handleButtonRelease() {
		clearTimeout(this.buttonPressTimer);
	}

	

	render() {
		const todo_lst = this.state.lst.map(items => <Todoitem key={items.id} 
															   item={items} 
															   onChange={this.handleChange} 
															   onMouseDown={this.handleButtonPress}
															   onMouseUp={this.handleButtonRelease}
															   />);
		return(
			<div className="container">
				<div>
					<ul>
						{todo_lst.map(x => <li key={x.key}> {x} </li>)}
					</ul>
				</div>
				<div>
					<Addbox handleSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.newtask} />
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
					<textarea id="addbox" name="newtask" value={this.props.value} onChange={this.props.onChange}/>
					<br/>
					<button>Add</button>
				</form>
			</div>

		)
	}
}

class PopUp extends React.Component {
	render() {
		return(
			<div>
				<h1> Test </h1>
			</div>
		)
	}
}


ReactDOM.render(
	<App />,
	document.getElementById('root')
	);