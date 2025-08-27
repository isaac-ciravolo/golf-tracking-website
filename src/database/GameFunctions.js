const DATABASE_KEY = process.env.REACT_APP_DATABASE_KEY;

export const createGame = async (token, gameData) => {
  try {
    const res = await fetch(
      `https://creategame-${DATABASE_KEY}-uc.a.run.app/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
      }
    );

    if (res.status !== 200)
      return { status: res.status, error: await res.text() };
    return { status: res.status, data: await res.text() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const createRandom9HoleGame = async (token) => {
  try {
    const res = await fetch(
      `https://creategame-${DATABASE_KEY}-uc.a.run.app?random9=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status !== 200)
      return { status: res.status, error: await res.text() };
    return { status: res.status, data: await res.text() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const createRandom18HoleGame = async (token) => {
  try {
    const res = await fetch(
      `https://creategame-${DATABASE_KEY}-uc.a.run.app?random18=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status !== 200)
      return { status: res.status, error: await res.text() };
    return { status: res.status, data: await res.text() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const deleteGame = async (token, gameId) => {
  try {
    const res = await fetch(
      `https://deletegame-${DATABASE_KEY}-uc.a.run.app/?gameId=${gameId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status !== 200)
      return { status: res.status, error: await res.text() };
    return { status: res.status, data: await res.text() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const updateGame = async (token, gameId, gameData) => {
  try {
    const res = await fetch(
      `https://updategame-${DATABASE_KEY}-uc.a.run.app/?gameId=${gameId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
      }
    );

    if (res.status !== 200)
      return { status: res.status, error: await res.text() };
    return { status: res.status, data: await res.text() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};

export const fetchGame = async (token, gameId) => {
  try {
    const res = await fetch(
      `https://fetchgame-${DATABASE_KEY}-uc.a.run.app/?gameId=${gameId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status !== 200)
      return { status: res.status, error: await res.text() };
    return { status: res.status, data: await res.json() };
  } catch (error) {
    return { status: 500, error: error.message };
  }
};
