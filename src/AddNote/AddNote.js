import React from 'react';
import NoteContext from '../NoteContext';
import './AddNote.css';

export default class AddNote extends React.Component {
    static contextType = NoteContext;

    state = {
        error: null
    };

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
                    <input
                        type='text'
                        name='noteName'
                        id='noteName'
                        placeholder='Unicorns'
                        required
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
                    <input
                        type='text'
                        name='noteContent'
                        id='noteContent'
                        placeholder='Unicorns are magical creatures'
                        required
                    />
                    <div className="noteButtons">
                    <button
                        type='submit'
                        className='noteButton__add'>
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