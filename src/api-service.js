export default {

  getSound: (userID) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/sound/user/${userID}`, options)
      .then(response => response.json());
  },

  getNote: (soundID) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/sound/${soundID}/note`, options)
      .then(response => response.json());
  },

  getSoundRaw: (soundID) => {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'audio/webm',
      },
    };
    return fetch(`/api/sound/${soundID}/raw`, options)
      .then(response => response.blob());
  },

  getSoundInfo: (soundID) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/sound/${soundID}`, options)
      .then(response => response.json());
  },


  createNote: ({ text, submit_time }, soundID) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ text, submit_time }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`/api/sound/${soundID}/note`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in POST /api/note');
        }
        return response.json();
      });
  },

  createSoundRaw: ({ blob }, soundID) => {
    const formData = new FormData();
    formData.append('recording', blob, `${soundID}.webm`); // <---- add filename formData.append('recording', blob, `$(sound_id)_file`);
    const options = {
      method: 'POST',
      body: formData,
    };
    return fetch(`/api/sound/${soundID}/raw`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in POST /api/sound');
        }
        return response.json();
      });
  },

  createSound: ({ title, startTime, userID }) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ title, startTime, userID }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch('/api/sound', options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in POST /api/sound');
        }
        return response.json();
      });
  },

  putSoundInfo: ({ title, startTime, endTime }, soundID) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify({ title, startTime, endTime }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`/api/sound/${soundID}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in PUT /api/sound');
        }
        return response.json();
      });
  },


  putText: ({ text }, noteID) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify({ text }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`/api/sound/note/${noteID}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in PUT /api/sound');
        }
        return response.json();
      });
  },


  deleteSound: (sound) => {
    const options = {
      method: 'DELETE',
    };
    return fetch(`/api/sound/${sound.id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error in DELETE /api/sound');
        }
        return response.json();
      });
  },

};
