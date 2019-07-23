import React from 'react';
import NoteContext from '../NoteContext';
import './AddNote.css';

export default class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: '',
                touched: false
            },
            content: {
                value: '',
                touched: false
            },
            error: null
        }
    }

    static contextType = NoteContext;

    handleSubmit = e => {
        e.preventDefault();
        const { noteName, noteFolder, noteContent } = e.target;
        const date = new Date();
        const isoDate = date.toISOString();
        const note = {
            'name': noteName.value,
            'modified': isoDate,
            'folderId': noteFolder.value,
            'content': noteContent.value,
        }
        this.setState({error: null})
        console.log(note);
        const url = 'http://localhost:9090/notes';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {'content-type': 'application/json'},
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {throw error})
            }
            return response.json()
        })
        .then(data => {
            this.context.addNote(data);
            this.props.history.push(`/note/${data.id}`);
        })
        .catch(error => {
            this.setState(error)
        })
    }

    updateName(name) {
        this.setState({name: {value: name, touched: true}})
    }

    updateContent(content) {
        this.setState({content: {value: content, touched: true}})
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return 'Name is required';
        }
    }

    validateContent() {
        const content = this.state.content.value.trim();
        if (content.length === 0) {
            return 'Content is required'
        }
    }

    handleClickCancel = () => {
        this.props.history.push('/');
    };

    render() {
        const folderOptions = this.context.folders.map(folder => {
            return (
                <option
                    value={folder.id}
                    key={folder.id}>
                    {folder.name}
                </option>)
        });
        const { error } = this.state;

        return (
            <div>
                <form onSubmit={this.handleSubmit} className='noteForm'>
                    <label htmlFor='noteName'>
                        Note Name
                    </label>
                    <span className='error'>
                            {this.state.name.touched && this.validateName()}
                    </span>
                    <input
                        type='text'
                        name='noteName'
                        id='noteName'
                        placeholder='Unicorns'
                        onChange={e => this.updateName(e.target.value)}
                    />
                    <label htmlFor='noteFolder'>
                        Folder
                    </label>
                    <select
                        name='noteFolder'
                        id='noteFolder'
                        required
                    >
                        {folderOptions}
                    </select>
                    <label htmlFor='noteContent'>
                        Content
                    </label>
                    <span className='error'>
                            {this.state.content.touched && this.validateContent()}
                    </span>
                    <input
                        type='text'
                        name='noteContent'
                        id='noteContent'
                        placeholder='Unicorns are magical creatures'
                        onChange={e => this.updateContent(e.target.value)}
                    />
                    <div className="noteButtons">
                    <button
                        type='submit'
                        className='noteButton__add'
                        disabled={
                            this.validateName() ||
                            this.validateContent()
                        }>
                        Add
                    </button>
                    <button
                        type='button'
                        className='noteButton__cancel'
                        onClick={this.handleClickCancel}>
                        Cancel
                    </button>
                    </div>
                </form>
                <div className='AddBookmark__error' role='alert'>
                    {error && <p>{error.message}</p>}
                </div>
            </div>
        )
    }
}