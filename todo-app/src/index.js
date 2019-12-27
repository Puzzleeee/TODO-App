import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

let todo_data = [];

function Todoitem(props) {
	return(
		<div id={props.item.id} className={props.item.completed ? "completed" : "todo-item"} onMouseDown={props.onMouseDown} onMouseUp={props.onMouseUp}>
				<input id={props.item.id} name="check" type="checkbox" checked={props.item.completed} onChange={props.onChange}/>
				<span> 
					{props.item.text}
				</span>
				<button id={props.item.id} className="crossbutton" name="xbutton" onClick={props.onChange}>X</button> 
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
		})), 750);
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
				{todo_lst}
				<Addbox onSubmit={this.handleSubmit} onChange={this.handleChange} value={this.state.newtask} />
				{this.state.popup ? <PopUp value={this.state.modifytask} 
											   onChange={this.handleChange}
											   onSubmit={this.handleSubmit}
											   />
									  : null}
				<p>Hold left click to edit items!</p>
			</div>
		);
	}
}

class Addbox extends React.Component {
	render() {
		return(
			<div className="formtext">
				<form name="newtask" onSubmit={this.props.onSubmit}>
					<p className="formfield">
						<label htmlFor="addbox"> Add new task: </label>
						<textarea id="addbox" name="newtask" value={this.props.value} onChange={this.props.onChange}/>
					</p>
					<button>Add</button>
				</form>
			</div>

		)
	}
}

class PopUp extends React.Component {
	render() {
		return(
				<div className="popup">
						<form  className="popuptext" name="modifytask" onSubmit={this.props.onSubmit}>
							<label htmlFor="modifybox"> Modify task: </label>
							<textarea id="modifybox" name="modifytask" value={this.props.value} onChange={this.props.onChange}/>
							<br/>
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