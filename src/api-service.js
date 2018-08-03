export default {
  
  getSound: () => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/sound`, options)
      .then(response => response.json());
  },

  getNote: (sound_id) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/sound/${sound_id}/note`, options)
      .then(response => response.json());
  },

  getSoundRaw: (sound_id) => {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'audio/webm'
      },
    };
    return fetch(`/api/sound/${sound_id}/raw`, options)
      .then(response => response.blob());
  },

  getSoundInfo: (sound_id) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/sound/${sound_id}`, options) 
      .then(response => response.json());
  },


  createNote: ({ text, submit_time},sound_id) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ text, submit_time }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`/api/sound/${sound_id}/note`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in POST /api/note");
        }
        return response.json();
      });
  },

  createSoundRaw: ({ blob },sound_id) => {
    var formData = new FormData();
    formData.append('recording', blob, `${sound_id}.webm`); // <---- add filename formData.append('recording', blob, `$(sound_id)_file`);
    const options = {
      method: 'POST',
      body: formData,
    };
    return fetch(`/api/sound/${sound_id}/raw`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in POST /api/sound");
        }
        return response.json();
      });
  },

  createSound: ({ title,startTime}) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ title, startTime }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`/api/sound`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in POST /api/sound");
        }
        return response.json();
      });
  },

  putSoundInfo: ({ title,startTime,endTime},sound_id) => {
    const options = {
      method: 'PUT',
      body: JSON.stringify({ title, startTime, endTime }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`/api/sound/${sound_id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in PUT /api/sound");
        }
        return response.json();
      });
  },

  deleteSound: (sound) => {
    console.log('sound = ', sound);
    const options = {
      method: 'DELETE',
    };
    return fetch(`/api/sound/${sound.id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in DELETE /api/sound");
        }
        return response.json();
      });
  },

};