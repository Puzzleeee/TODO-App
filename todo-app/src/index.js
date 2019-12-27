import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

let todo_data = [];

function Todoitem(props) {
	return(
		<div id={props.item.id} className="itemcontainer" onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}>
			<span  className={props.item.completed ? "completed" : "todo-item"}>
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
			popupid: Infinity,
			modifytask: ""
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
		} else if (name === "close") {
			this.setState({
				popup: false,
				popupid: Infinity
			});
		}
		else {
			this.setState({
				[name] : value
			})
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		if (event.target.name === "newtask") {
			const new_id = this.state.lst.length;
			const new_text = this.state.newtask;
			const new_task = {id:new_id, text:new_text, completed:false,}
			const copied = this.state.lst.slice();
			copied.push(new_task);
			this.setState({
				lst:copied,
				newtask: ""
			});
		} else {
			const idx = this.state.popupid;
			const new_text = this.state.modifytask;
			const new_task = {id:idx, text:new_text, completed:false}
			const copied = this.state.lst.slice();
			copied[idx] = new_task;
			this.setState({
				lst:copied,
				popup: false,
				popupid: Infinity,
				modifytask: ""
			})
		}
	}

	handleButtonPress(event) {
		const idx = event.currentTarget.id;
		this.buttonPressTimer = setTimeout(() => this.setState(prev => ({
			popup: true,
			popupid: idx
		})), 1500);
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
					<Addbox onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.newtask} />
				</div>
				<div>
					{this.state.popup ? <PopUp value={this.state.modifytask} 
											   onChange={this.handleChange}
											   onSubmit={this.handleSubmit}
											   />
									  : null}
				</div>
			</div>
		);
	}
}

class Addbox extends React.Component {
	render() {
		return(
			<div>
				<form name="newtask" onSubmit={this.props.onSubmit}>
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
				<form name="modifytask" onSubmit={this.props.onSubmit}>
					<label htmlFor="modifybox"> Modify task: </label>
					<textarea id="modifybox" name="modifytask" value={this.props.value} onChange={this.props.onChange}/>
					<button name="close" onClick={this.props.onChange}>Cancel</button>
					<button>Confirm</button>
				</form>
			</div>
		)
	}
}


ReactDOM.render(
	<App />,
	document.getElementById('root')
	);