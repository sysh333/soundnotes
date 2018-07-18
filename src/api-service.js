export default {
  
  getItems: (sound_id) => {
    const options = {
      method: 'GET',
    };
    return fetch(`/api/note?sound_id=${sound_id}`, options)
      .then(response => response.json());
  },
  
  createItem: ({ text, time},sound_id) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ text, time }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch(`/api/note?sound_id=${sound_id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in POST /api/note");
        }
        return response.json();
      });
  },
  createSound: ({ title, recordingData, startTime, endTime},sound_id) => {
    var formData = new FormData();
    formData.append("title", title);
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append('recording', recordingData);
    const options = {
      method: 'POST',
      body: formData,
      //headers: {
      //  'content-type': 'undefined',
      //},
    };
    return fetch(`/api/sound?sound_id=${sound_id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in POST /api/sound");
        }
        return response.json();
      });
  },
  /*
  deleteItem: (item) => {
    console.log('item = ', item);
    // DELETE request:
    // /api/items?id=${id}
    const options = {
      method: 'DELETE',
    };
    return fetch(`/api/items?id=${item.id}`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in DELETE /api/items");
        }
        return response.json();
      });
  },
  */
};