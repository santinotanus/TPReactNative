// src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunk para GET
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_limit=10'
    );
    if (!response.ok) {
      throw new Error('Error al obtener publicaciones');
    }
    const data = await response.json();
    return data;
  }
);

// Thunk para POST
export const addPost = createAsyncThunk(
  'posts/addPost',
  async (newPost) => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }
    );
    if (!response.ok) {
      throw new Error('Error al crear la publicación');
    }
    const data = await response.json();
    return data;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Si quisieras agregar acciones síncronas locales, van acá.
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // POST
      .addCase(addPost.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Inserta el nuevo post al inicio
        state.items.unshift(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default postsSlice.reducer;
