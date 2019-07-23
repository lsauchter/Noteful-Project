import React from 'react';
import './AddFolder.css';
import NoteContext from '../NoteContext';

export default class AddFolder extends React.Component {
    static contextType = NoteContext;

    state = {
        error: null
    };

    handleSubmit = e => {
        e.preventDefault();
        const folderName = e.target.folderName.value;
        const folder = {'name': folderName}
        this.setState({ error: null })
        const url = 'http://localhost:9090/folders';
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {'content-type': 'application/json'},
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => {throw error})
            }
            return response.json()
        })
        .then(data => {
            this.context.addFolder(data);
            this.props.history.push(`/folder/${data.id}`);
        })
        .catch(error => {
            this.setState({ error })
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/');
    };

    render() {
        const { error } = this.state
        return (
            <div>
                <form onSubmit={this.handleSubmit} className='folderForm'>
                    <label htmlFor='folderName'>
                        Folder Name:
                    </label>
                    <input
                        type='text'
                        name='folderName'
                        id='folderName'
                        placeholder='New Folder'
                        required
                    />
                    <div className="folderButtons">
                    <button
                        type='button'
                        className='folderButton__cancel'
                        onClick={this.handleClickCancel}>
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className='folderButton__add'>
                        Add
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