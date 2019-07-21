import React from 'react';

const NoteContext = React.createContext({
    notes: [],
    folders: [],
})

export default NoteContext