export default {
  /*
  getItems: () => {
    const options = {
      method: 'GET',
    };
    return fetch('/api/items', options)
      .then(response => response.json());
  },
  */
  createItem: ({ text, time, sound_id }) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ text, time, sound_id }),
      headers: {
        'content-type': 'application/json',
      },
    };
    return fetch('/api/note', options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in POST /api/note");
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