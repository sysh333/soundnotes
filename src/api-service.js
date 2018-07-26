export default {
  
  getNote: (sound_id) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/sound/${sound_id}/note`, options)
      .then(response => response.json());
  },

  getSound: (sound_id) => {
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'audio/webm'
      },
    };
    return fetch(`/api/sound?sound_id=${sound_id}`, options)
      .then(response => response.blob());
  },

  getSoundInfo: (sound_id) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/info?sound_id=${sound_id}`, options) 
      .then(response => response.json());
  },

  createNote: ({ text, time},sound_id) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ text, time }),
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

  createSound: ({ title, blob, startTime, endTime},sound_id) => {
    var formData = new FormData();
    formData.append("title", title);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append('recording', blob, "test.webm"); // <---- add filename formData.append('recording', blob, `$(sound_id)_file`);
    const options = {
      method: 'POST',
      body: formData,
    };
    return fetch(`/api/sound?sound_id=${sound_id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in POST /api/sound");
        }
        return response.json();
      });
  },
};