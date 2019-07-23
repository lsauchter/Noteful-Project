import React from 'react'
import { Link } from 'react-router-dom'
import NoteContext from '../NoteContext'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Note from '../Note/Note'
import { getNotesForFolder } from '../notes-helpers'
import CircleButton from '../CircleButton/CircleButton'
import NoteError from '../NoteError'
import './NoteListMain.css'

export default class NoteListMain extends React.Component {
  static contextType = NoteContext

  state = {
    deleted: ''
  }

  deleteNote = (name) => {
    this.setState({deleted: <p className="deleted">{name} deleted </p>});
    setTimeout(() => {this.setState({deleted: ''})}, 5000);
  }

  render() {
    const { folderId } = this.props.match.params
    const { notes=[] } = this.context
    const notesForFolder = getNotesForFolder(notes, folderId)
    let deleted = this.state.deleted

  return (
    <section className='NoteListMain'>
      {deleted}
      <ul>
        {notesForFolder.map(note =>
          <li key={note.id}>
            <NoteError>
            <Note
              id={note.id}
              name={note.name}
              modified={note.modified}
              deleteNote={(noteName) => this.deleteNote(noteName)}
            />
            </NoteError>
          </li>
        )}
      </ul>
      <div className='NoteListMain__button-container'>
        <CircleButton
          tag={Link}
          to='/add-note'
          type='button'
          className='NoteListMain__add-note-button'
        >
          <FontAwesomeIcon icon='plus' />
          <br />
          Note
        </CircleButton>
      </div>
    </section>
  )
}}

NoteListMain.defaultProps = {
  match: {
    params: {}
  }
}

NoteListMain.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object.isRequired
  })
}
