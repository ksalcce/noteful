import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import ApiContext from '../ApiContext'
import config from '../config'
import CheckError from '../CheckError'
import CheckAppError from './CheckAppError'
import PropTypes from "prop-types";

import './App.css'


class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/notes`),
      fetch(`${config.API_ENDPOINT}/folders`)
    ])
      .then(([notesRes, foldersRes]) => {
        if (!notesRes.ok)
          return notesRes.json().then(e => Promise.reject(e))
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e))

        return Promise.all([
          notesRes.json(),
          foldersRes.json(),
        ])
      })
      .then(([notes, folders]) => {
        this.setState({ notes, folders })
      })
      .catch(error => {
        console.error({ error })
      })
  }

  handleAddFolder = folder => {
    this.setState({
      folders: [
        ...this.state.folders,
        folder
      ]
    })
  }

  handleAddNote = note => {
    this.setState({
      notes: [
        ...this.state.notes,
        note
      ]
    })
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    })
  }

  renderNavRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={(props) => (
              <CheckError>
                <NoteListNav {...props}/>
              </CheckError>
            )}
          />
        )}
        <Route
          path='/note/:noteId'
          render={(props) => (
            <CheckError>
              <NotePageNav {...props}/>
            </CheckError>
          )}
        />
        <Route
          path='/add-folder'
          render={(props) => (
            <CheckError>
              <NotePageNav {...props}/>
            </CheckError>
          )}
        />
        <Route
          path='/add-note'
          render={(props) => (
            <CheckError>
              <NotePageNav {...props}/>
            </CheckError>
          )}
        />
      </>
    )
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          <Route
            exact
            key={path}
            path={path}
            render={(props) => (
              <CheckError>
                <NoteListMain {...props}/>
              </CheckError>
            )}
          />
        )}
        <Route
          path='/note/:noteId'
          render={(props) => (
            <CheckError>
              <NotePageMain {...props}/>
            </CheckError>
          )}
        />
        <Route
          path='/add-folder'
          render={(props) => (
            <CheckError>
              <AddFolder {...props}/>
            </CheckError>
          )}
        />
        <Route
          path='/add-note'
          render={(props) => (
            <CheckError>
              <AddNote {...props}/>
            </CheckError>
          )}
        />
      </>
    )
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
      deleteNote: this.handleDeleteNote,
    }
    return (
      <CheckAppError>
        <ApiContext.Provider value={value}>
          <div className='App'>
            <nav className='App__nav'>
              {this.renderNavRoutes()}
            </nav>
            <header className='App__header'>
              <h1>
                <Link to='/'>Noteful</Link>
                {' '}
                <FontAwesomeIcon icon='check-double' />
              </h1>
            </header>
            <main className='App__main'>
              {this.renderMainRoutes()}
            </main>
          </div>
        </ApiContext.Provider>
      </CheckAppError>
    )
  }
}

export default App

ApiContext.Provider.propTypes = {
  value: PropTypes.shape({
    notes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    folders: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    deleteNote: PropTypes.func,
    addNote: PropTypes.func,
    addFolder: PropTypes.func
  })
}