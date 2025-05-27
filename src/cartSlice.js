import { createSlice } from '@reduxjs/toolkit';

/* ───────── helpers for persistence ───────── */
const CART_KEY = 'cart';
const DIRECT_KEY = 'directPurchase'; // ✅ UPDATED to match usage in other components

/* ---------- local-storage helpers (cart) ---------- */
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
};
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

/* ---------- session-storage helpers (Buy-now) ---------- */
const loadDirect = () => {
  try {
    return JSON.parse(sessionStorage.getItem(DIRECT_KEY) || 'null');
  } catch {
    return null;
  }
};
const saveDirect = (obj) =>
  sessionStorage.setItem(DIRECT_KEY, JSON.stringify(obj));
const clearDirectStore = () => sessionStorage.removeItem(DIRECT_KEY);

/* ───────── slice ───────── */
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(), // persistent cart
    directPurchase: loadDirect(), // survive refresh in the same tab
  },

  reducers: {
    /* ----- ordinary cart actions ----- */
    addItem(state, action) {
      const { _id, colour, size } = action.payload;
      const idx = state.items.findIndex(
        (it) => it._id === _id && it.colour === colour && it.size === size
      );

      if (idx >= 0) {
        state.items[idx].qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      saveCart(state.items);
    },

    updateQty(state, action) {
      const { idx, delta } = action.payload;
      if (state.items[idx]) {
        state.items[idx].qty = Math.max(1, state.items[idx].qty + delta);
        saveCart(state.items);
      }
    },

    removeItem(state, action) {
      const idx = action.payload;
      if (state.items[idx]) {
        state.items.splice(idx, 1);
        saveCart(state.items);
      }
    },

    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },

    /* ----- direct-purchase actions ----- */
    setDirectPurchase(state, action) {
      // payload = variant object
      state.directPurchase = action.payload;
      saveDirect(action.payload); // NEW  ════════════
    },

    clearDirectPurchase(state) {
      state.directPurchase = null;
      clearDirectStore(); // NEW  ════════════
    },
  },
});

/* ───────── selectors ───────── */
// exact variant present?
export const selectCartItem = (s, _id, colour, size) =>
  s.cart.items.find(
    (it) => it._id === _id && it.colour === colour && it.size === size
  );

// count of distinct rows
export const selectCartCount = (s) => s.cart.items.length;

// full list
export const selectCartItems = (s) => s.cart.items;

// grand total of cart
export const selectCartTotal = (s) =>
  s.cart.items.reduce((sum, it) => sum + it.price * it.qty, 0);

// total quantity (sum of qty)
export const selectCartTotalQty = (s) =>
  s.cart.items.reduce((sum, it) => sum + it.qty, 0);

// ----- direct-purchase -----
export const selectDirectPurchase = (s) => s.cart.directPurchase;

/* ───────── exports ───────── */
export const {
  addItem,
  updateQty,
  removeItem,
  clearCart,
  setDirectPurchase,
  clearDirectPurchase,
} = cartSlice.actions;

export default cartSlice.reducer;
